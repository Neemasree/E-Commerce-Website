const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const isValidId = (value) => mongoose.isValidObjectId(value);

// Create an order for the authenticated user.
// The server recalculates prices and totals from database records instead of trusting client totals.
router.post('/', authenticateToken, async (req, res) => {
  const { items, address, paymentMethod = 'cod' } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'An order must contain at least one item' });
  }
  if (!address || typeof address !== 'object') {
    return res.status(400).json({ message: 'Delivery address is required' });
  }
  if (!['cod', 'card', 'upi'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Unsupported payment method' });
  }

  try {
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!item || !isValidId(item.product) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return res.status(400).json({ message: 'Each item must have a valid product ID and quantity from 1 to 99' });
      }

      const product = await Product.findById(item.product).lean();
      if (!product) {
        return res.status(400).json({ message: 'One or more products are unavailable' });
      }
      if (!Number.isFinite(product.price) || product.price < 0 || (product.stock != null && product.stock < item.quantity)) {
        return res.status(409).json({ message: `Insufficient stock for ${product.name}` });
      }

      const unitPrice = Number.isFinite(product.offerPrice) && product.offerPrice > 0
        ? product.offerPrice
        : product.price;
      subtotal += unitPrice * item.quantity;
      validatedItems.push({
        product: product._id,
        name: product.name,
        price: unitPrice,
        quantity: item.quantity,
        image: product.image
      });
    }

    const deliveryFee = subtotal >= 500 ? 0 : 50;
    const total = subtotal + deliveryFee;

    // Use a MongoDB transaction so inventory decrements and order creation succeed or fail together.
    const session = await mongoose.startSession();
    let createdOrder;

    try {
      await session.withTransaction(async () => {
        for (const item of validatedItems) {
          const updated = await Product.findOneAndUpdate(
            { _id: item.product, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { new: true, session }
          );
          if (!updated) {
            const stockError = new Error(`Stock changed during checkout for ${item.name}; please refresh your cart`);
            stockError.code = 'INSUFFICIENT_STOCK';
            throw stockError;
          }
        }

        const [order] = await Order.create([{
          user: req.user.id,
          items: validatedItems,
          total,
          address,
          paymentMethod
        }], { session });
        createdOrder = order;
      });
    } catch (error) {
      if (error.code === 'INSUFFICIENT_STOCK') {
        return res.status(409).json({ message: error.message });
      }
      throw error;
    } finally {
      await session.endSession();
    }

    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation failed:', error);
    return res.status(500).json({ message: 'Unable to create order' });
  }
});

// Users may only read their own orders.
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Order listing failed:', error);
    res.status(500).json({ message: 'Unable to fetch orders' });
  }
});

// Only administrators may view every customer's orders.
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Admin order listing failed:', error);
    res.status(500).json({ message: 'Unable to fetch admin orders' });
  }
});

// Customers can cancel only their own pending order.
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, status: 'pending' },
      { $set: { status: 'cancelled' } },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Pending order not found for this user' });
    }
    res.json(order);
  } catch (error) {
    console.error('Order cancellation failed:', error);
    res.status(500).json({ message: 'Unable to cancel order' });
  }
});

module.exports = router;
