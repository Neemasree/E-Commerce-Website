const assert = require('node:assert/strict');
const test = require('node:test');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'freshmart-integration-test-secret-at-least-32-chars';
process.env.JWT_SECRET = secret;
const { app } = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const uri = process.env.MONGO_INTEGRATION_URI;

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

  const health = await fetch(`${base}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok', database: 'connected' });

  const missingRoute = await fetch(`${base}/api/not-a-real-route`);
  assert.equal(missingRoute.status, 404);
  assert.deepEqual(await missingRoute.json(), { message: 'Route not found' });
  assert.equal(missingRoute.headers.get('x-powered-by'), null);
  assert.equal(missingRoute.headers.get('x-frame-options'), 'DENY');
  assert.equal(missingRoute.headers.get('cache-control'), 'no-store');

  const blockedOrigin = await fetch(`${base}/api/products`, {
    headers: { Origin: 'https://untrusted.example.test' }
  });
  assert.equal(blockedOrigin.status, 403);
  assert.deepEqual(await blockedOrigin.json(), { message: 'Origin not allowed' });

  const malformedJson = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"email":'
  });
  assert.equal(malformedJson.status, 400);
  assert.deepEqual(await malformedJson.json(), { message: 'Invalid JSON request body' });

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

  const unsupportedPayment = await fetch(`${base}/api/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ product: String(product._id), quantity: 1 }],
      address: { fullName: 'Integration Customer', email: 'integration@example.test', phone: '9876543210', address: '1 Test Road', city: 'Coimbatore', pincode: '641001' },
      paymentMethod: 'card'
    })
  });
  assert.equal(unsupportedPayment.status, 400);

  const invalidOfferUpdate = await fetch(`${base}/api/products/${adminProduct._id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: 30, offerPrice: 35 })
  });
  assert.equal(invalidOfferUpdate.status, 400);

  const validProductUpdate = await fetch(`${base}/api/products/${adminProduct._id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: 30, offerPrice: 25 })
  });
  assert.equal(validProductUpdate.status, 200);
  assert.equal((await validProductUpdate.json()).offerPrice, 25);

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

  const zeroPriceProduct = await Product.create({
    name: 'Zero Offer Product', price: 50, offerPrice: 0, image: 'https://example.test/free.jpg',
    category: 'test', stock: 1, description: 'Valid zero price promotion'
  });
  const zeroOfferCheckout = await fetch(`${base}/api/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ product: String(zeroPriceProduct._id), quantity: 1 }],
      address: { fullName: 'Integration Customer', email: 'integration@example.test', phone: '9876543210', address: '1 Test Road', city: 'Coimbatore', pincode: '641001' },
      paymentMethod: 'cod'
    })
  });
  assert.equal(zeroOfferCheckout.status, 201);
  const zeroOfferOrder = await zeroOfferCheckout.json();
  assert.equal(zeroOfferOrder.items[0].price, 0);
  assert.equal(zeroOfferOrder.total, 50);

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

  const customerAdminList = await fetch(`${base}/api/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(customerAdminList.status, 403);

  const adminOrderList = await fetch(`${base}/api/admin/orders`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(adminOrderList.status, 200);
  assert.ok((await adminOrderList.json()).some((entry) => entry._id === order._id));

  const nextOrderResponse = await fetch(`${base}/api/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ product: String(product._id), quantity: 1 }],
      address: { fullName: 'Integration Customer', email: 'integration@example.test', phone: '9876543210', address: '1 Test Road', city: 'Coimbatore', pincode: '641001' },
      paymentMethod: 'cod'
    })
  });
  assert.equal(nextOrderResponse.status, 201);
  const nextOrder = await nextOrderResponse.json();

  const forbiddenStatusUpdate = await fetch(`${base}/api/admin/orders/${nextOrder._id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'confirmed' })
  });
  assert.equal(forbiddenStatusUpdate.status, 403);

  for (const status of ['confirmed', 'shipped', 'delivered']) {
    const update = await fetch(`${base}/api/admin/orders/${nextOrder._id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    assert.equal(update.status, 200);
    assert.equal((await update.json()).status, status);
  }

  const invalidTransition = await fetch(`${base}/api/admin/orders/${nextOrder._id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'confirmed' })
  });
  assert.equal(invalidTransition.status, 409);

  const deleteAdminProduct = await fetch(`${base}/api/products/${adminProduct._id}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(deleteAdminProduct.status, 200);
});
