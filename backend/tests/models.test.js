const assert = require('node:assert/strict');
const test = require('node:test');

const Product = require('../models/Product');
const Order = require('../models/Order');

function validProduct(overrides = {}) {
  return new Product({
    name: 'Fresh Apples',
    price: 120,
    offerPrice: 100,
    image: 'https://images.example.test/apples.jpg',
    category: 'fruits',
    stock: 10,
    description: 'Fresh red apples',
    images: ['https://images.example.test/apples.jpg'],
    ...overrides
  });
}

test('product model accepts a valid product', async () => {
  await assert.doesNotReject(validProduct().validate());
});

test('product model rejects negative stock', async () => {
  await assert.rejects(validProduct({ stock: -1 }).validate(), /stock/i);
});

test('product model rejects an offer price above the regular price', async () => {
  await assert.rejects(validProduct({ price: 100, offerPrice: 120 }).validate(), /offer price/i);
});

test('product model rejects missing required product details', async () => {
  await assert.rejects(new Product({ name: 'X' }).validate());
});

function validOrder(overrides = {}) {
  return new Order({
    user: '507f1f77bcf86cd799439011',
    items: [{
      product: '507f1f77bcf86cd799439012',
      name: 'Fresh Apples',
      price: 100,
      quantity: 2
    }],
    total: 250,
    address: {
      fullName: 'Test Customer',
      email: 'customer@example.test',
      phone: '9876543210',
      address: '12 Market Road',
      city: 'Coimbatore',
      pincode: '641001'
    },
    paymentMethod: 'cod',
    ...overrides
  });
}

test('order model accepts valid delivery details and line items', async () => {
  await assert.doesNotReject(validOrder().validate());
});

test('order model rejects unsupported payment methods', async () => {
  await assert.rejects(validOrder({ paymentMethod: 'crypto' }).validate(), /paymentMethod/i);
});
