const assert = require('node:assert/strict');
const test = require('node:test');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const uri = process.env.MONGO_INTEGRATION_URI;
const secret = 'freshmart-integration-test-secret-at-least-32-chars';
process.env.JWT_SECRET = secret;

test('real MongoDB checkout, ownership, and cancellation integration', { skip: !uri }, async (t) => {
  process.env.JWT_SECRET = secret;
  await mongoose.connect(uri);
  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);

  const password = await bcrypt.hash('integration-password', 4);
  const user = await User.create({ name: 'Integration Customer', email: 'integration@example.test', password });
  const admin = await User.create({ name: 'Integration Admin', email: 'admin-integration@example.test', password, role: 'admin' });
  const product = await Product.create({
    name: 'Integration Apples', price: 100, offerPrice: 80, image: 'https://example.test/apples.jpg',
    category: 'fruit', stock: 5, description: 'Integration test product'
  });
  const token = jwt.sign({ id: user._id, role: 'user' }, secret, { expiresIn: '5m' });
  const adminToken = jwt.sign({ id: admin._id, role: 'admin' }, secret, { expiresIn: '5m' });
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);
    await mongoose.disconnect();
  });

  const registration = await fetch(`${base}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'New Customer', email: ' NEW-CUSTOMER@example.test ', password: 'strong-password-123' })
  });
  assert.equal(registration.status, 201);
  const registered = await registration.json();
  assert.equal(registered.user.email, 'new-customer@example.test');
  assert.ok(registered.token);

  const duplicateRegistration = await fetch(`${base}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'New Customer', email: 'new-customer@example.test', password: 'strong-password-123' })
  });
  assert.equal(duplicateRegistration.status, 409);

  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ' NEW-CUSTOMER@example.test ', password: 'strong-password-123' })
  });
  assert.equal(login.status, 200);
  assert.ok((await login.json()).token);

  const forbiddenProductCreate = await fetch(`${base}/api/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Forbidden Product', price: 10, image: 'https://example.test/x.jpg', category: 'test', stock: 1, description: 'Should not be created' })
  });
  assert.equal(forbiddenProductCreate.status, 403);

  const adminProductCreate = await fetch(`${base}/api/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Admin Created Product', price: 25, offerPrice: 20, image: 'https://example.test/admin.jpg', category: 'test', stock: 4, description: 'Created by admin integration test', injectedField: 'must be ignored' })
  });
  assert.equal(adminProductCreate.status, 201);
  const adminProduct = await adminProductCreate.json();
  assert.equal(adminProduct.name, 'Admin Created Product');
  assert.equal(adminProduct.injectedField, undefined);

  const publicProductList = await fetch(`${base}/api/products?search=Admin%20Created`);
  assert.equal(publicProductList.status, 200);
  assert.ok((await publicProductList.json()).some((item) => item._id === adminProduct._id));

  const checkout = await fetch(`${base}/api/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ product: String(product._id), quantity: 2, price: 1 }],
      total: 1,
      address: { fullName: 'Integration Customer', email: 'integration@example.test', phone: '9876543210', address: '1 Test Road', city: 'Coimbatore', pincode: '641001' },
      paymentMethod: 'cod'
    })
  });
  assert.equal(checkout.status, 201);
  const order = await checkout.json();
  assert.equal(order.total, 210);
  assert.equal(order.items[0].price, 80);
  assert.equal((await Product.findById(product._id)).stock, 3);

  const foreignToken = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'user' }, secret, { expiresIn: '5m' });
  const foreignRead = await fetch(`${base}/api/orders`, { headers: { Authorization: `Bearer ${foreignToken}` } });
  assert.equal(foreignRead.status, 200);
  assert.deepEqual(await foreignRead.json(), []);

  const cancel = await fetch(`${base}/api/orders/${order._id}/cancel`, {
    method: 'PUT', headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(cancel.status, 200);
  assert.equal((await cancel.json()).status, 'cancelled');
  assert.equal((await Product.findById(product._id)).stock, 5);

  const secondCancel = await fetch(`${base}/api/orders/${order._id}/cancel`, {
    method: 'PUT', headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(secondCancel.status, 404);
});
