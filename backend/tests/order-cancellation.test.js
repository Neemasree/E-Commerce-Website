const assert = require('node:assert/strict');
const test = require('node:test');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Order = require('../models/Order');
const Product = require('../models/Product');
const orderRoutes = require('../routes/orderRoutes');

const TEST_SECRET = 'order-route-test-secret-at-least-32-characters';
const USER_ID = '507f1f77bcf86cd799439011';
const ORDER_ID = '507f1f77bcf86cd799439013';
const PRODUCT_ID = '507f1f77bcf86cd799439012';

async function startTestServer(t, { order, onRestock = () => {} }) {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = TEST_SECRET;

  const originals = {
    startSession: mongoose.startSession,
    findOneAndUpdate: Order.findOneAndUpdate,
    updateOne: Product.updateOne
  };

  const session = {
    transactionCalls: 0,
    ended: false,
    async withTransaction(callback) {
      this.transactionCalls += 1;
      return callback();
    },
    async endSession() {
      this.ended = true;
    }
  };

  mongoose.startSession = async () => session;
  Order.findOneAndUpdate = async (filter, update, options) => {
    assert.equal(String(filter._id), ORDER_ID);
    assert.equal(String(filter.user), USER_ID);
    assert.equal(filter.status, 'pending');
    assert.equal(update.$set.status, 'cancelled');
    assert.equal(options.session, session);

    if (!order) return null;
    order.status = 'cancelled';
    return order;
  };
  Product.updateOne = async (filter, update, options) => {
    onRestock(filter, update, options, session);
    return { acknowledged: true, modifiedCount: 1 };
  };

  const app = express();
  app.use(express.json());
  app.use('/api/orders', orderRoutes);
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    mongoose.startSession = originals.startSession;
    Order.findOneAndUpdate = originals.findOneAndUpdate;
    Product.updateOne = originals.updateOne;
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });

  return {
    url: `http://127.0.0.1:${server.address().port}/api/orders/${ORDER_ID}/cancel`,
    token: jwt.sign({ id: USER_ID, role: 'user' }, TEST_SECRET, { expiresIn: '5m' }),
    session
  };
}

test('cancelling a pending order restores each line quantity inside a transaction', async (t) => {
  const restocks = [];
  const order = {
    _id: ORDER_ID,
    user: USER_ID,
    status: 'pending',
    items: [
      { product: PRODUCT_ID, quantity: 2 },
      { product: PRODUCT_ID, quantity: 1 },
      { product: null, quantity: 1 }
    ]
  };

  const server = await startTestServer(t, {
    order,
    onRestock(filter, update, options, session) {
      restocks.push({ filter, update, options, session });
    }
  });

  const response = await fetch(server.url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${server.token}` }
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'cancelled');
  assert.equal(server.session.transactionCalls, 1);
  assert.equal(server.session.ended, true);
  assert.equal(restocks.length, 2);
  assert.deepEqual(restocks.map((entry) => entry.update.$inc.stock), [2, 1]);
  assert.ok(restocks.every((entry) => String(entry.filter._id) === PRODUCT_ID));
  assert.ok(restocks.every((entry) => entry.options.session === server.session));
});

test('cancelling an order that is not pending or not owned returns 404 without restocking', async (t) => {
  let restockCalls = 0;
  const server = await startTestServer(t, {
    order: null,
    onRestock() {
      restockCalls += 1;
    }
  });

  const response = await fetch(server.url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${server.token}` }
  });
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.message, 'Pending order not found for this user');
  assert.equal(server.session.transactionCalls, 1);
  assert.equal(server.session.ended, true);
  assert.equal(restockCalls, 0);
});
