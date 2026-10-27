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
  const { items, address, paymentMethod = 'cod' } = req.body || {};

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({ message: 'An order must contain between 1 and 50 items' });
  }
  const requiredAddressFields = ['fullName', 'email', 'phone', 'address', 'city', 'pincode'];
  if (!address || typeof address !== 'object' || Array.isArray(address) ||
      requiredAddressFields.some((field) => typeof address[field] !== 'string' || !address[field].trim())) {
    return res.status(400).json({ message: 'Complete delivery address details are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim())) {
    return res.status(400).json({ message: 'Enter a valid email address' });
  }
  if (!/^\d{10}$/.test(address.phone.trim()) || !/^\d{6}$/.test(address.pincode.trim())) {
    return res.status(400).json({ message: 'Enter a valid 10-digit phone number and 6-digit pincode' });
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
      if (!Number.isFinite(product.price) || product.price < 0 || !Number.isInteger(product.stock) || product.stock < item.quantity) {
        return res.status(409).json({ message: `Insufficient stock for ${product.name}` });
      }

      const unitPrice = Number.isFinite(product.offerPrice) && product.offerPrice > 0 && product.offerPrice <= product.price
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

// Customers can cancel only their own pending order. Inventory is restored atomically.
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  const session = await mongoose.startSession();
  let cancelledOrder;

  try {
    await session.withTransaction(async () => {
      const order = await Order.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id, status: 'pending' },
        { $set: { status: 'cancelled' } },
        { new: true, runValidators: true, session }
      );

      if (!order) {
        const notCancellable = new Error('Pending order not found for this user');
        notCancellable.code = 'ORDER_NOT_CANCELLABLE';
        throw notCancellable;
      }

      for (const item of order.items) {
        if (!item.product) continue;
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
          { session }
        );
      }

      cancelledOrder = order;
    });

    return res.json(cancelledOrder);
  } catch (error) {
    if (error.code === 'ORDER_NOT_CANCELLABLE') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Order cancellation failed:', error);
    return res.status(500).json({ message: 'Unable to cancel order' });
  } finally {
    await session.endSession();
  }
});

module.exports = router;
