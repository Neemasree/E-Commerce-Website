const assert = require('node:assert/strict');
const test = require('node:test');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Order = require('../models/Order');
const Product = require('../models/Product');
const orderRoutes = require('../routes/orderRoutes');

const TEST_SECRET = 'order-create-test-secret-at-least-32-characters';
const USER_ID = '507f1f77bcf86cd799439011';
const PRODUCT_ID = '507f1f77bcf86cd799439012';
const ORDER_ID = '507f1f77bcf86cd799439013';

test('order creation uses database prices and decrements inventory transactionally', async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = TEST_SECRET;

  const originals = {
    startSession: mongoose.startSession,
    findById: Product.findById,
    findOneAndUpdate: Product.findOneAndUpdate,
    create: Order.create
  };

  const product = {
    _id: PRODUCT_ID,
    name: 'Fresh Apples',
    price: 100,
    offerPrice: 80,
    stock: 10,
    image: 'https://images.example.test/apples.jpg'
  };
  let transactionCalls = 0;
  let ended = false;
  let stockUpdate;
  let createdOrder;

  const session = {
    async withTransaction(callback) {
      transactionCalls += 1;
      return callback();
    },
    async endSession() {
      ended = true;
    }
  };

  mongoose.startSession = async () => session;
  Product.findById = (id) => ({
    lean: async () => {
      assert.equal(String(id), PRODUCT_ID);
      return product;
    }
  });
  Product.findOneAndUpdate = async (filter, update, options) => {
    stockUpdate = { filter, update, options };
    return product;
  };
  Order.create = async (documents, options) => {
    assert.equal(options.session, session);
    createdOrder = { ...documents[0], _id: ORDER_ID, status: 'pending' };
    return [createdOrder];
  };

  const app = express();
  app.use(express.json());
  app.use('/api/orders', orderRoutes);
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    mongoose.startSession = originals.startSession;
    Product.findById = originals.findById;
    Product.findOneAndUpdate = originals.findOneAndUpdate;
    Order.create = originals.create;
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });

  const token = jwt.sign({ id: USER_ID, role: 'user' }, TEST_SECRET, { expiresIn: '5m' });
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{ product: PRODUCT_ID, quantity: 2, price: 1, name: 'Injected Product Name' }],
      total: 1,
      address: {
        fullName: 'Test Customer',
        email: 'customer@example.test',
        phone: '9876543210',
        address: '12 Market Road',
        city: 'Coimbatore',
        pincode: '641001'
      },
      paymentMethod: 'cod'
    })
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.total, 210);
  assert.equal(body.items[0].price, 80);
  assert.equal(body.items[0].name, 'Fresh Apples');
  assert.equal(body.items[0].quantity, 2);
  assert.equal(transactionCalls, 1);
  assert.equal(ended, true);
  assert.equal(stockUpdate.update.$inc.stock, -2);
  assert.equal(stockUpdate.filter.stock.$gte, 2);
  assert.equal(stockUpdate.options.session, session);
  assert.equal(createdOrder.user, USER_ID);
});

test('order creation rejects invalid quantities before opening a transaction', async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = TEST_SECRET;
  const originalStartSession = mongoose.startSession;
  let sessionsOpened = 0;
  mongoose.startSession = async () => {
    sessionsOpened += 1;
    throw new Error('A session should not be opened for invalid input');
  };

  const app = express();
  app.use(express.json());
  app.use('/api/orders', orderRoutes);
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    mongoose.startSession = originalStartSession;
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });

  const token = jwt.sign({ id: USER_ID, role: 'user' }, TEST_SECRET, { expiresIn: '5m' });
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{ product: PRODUCT_ID, quantity: 0 }],
      address: {
        fullName: 'Test Customer',
        email: 'customer@example.test',
        phone: '9876543210',
        address: '12 Market Road',
        city: 'Coimbatore',
        pincode: '641001'
      }
    })
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.match(body.message, /quantity/i);
  assert.equal(sessionsOpened, 0);
});
