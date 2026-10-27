const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const productFields = ['name', 'price', 'offerPrice', 'image', 'category', 'stock', 'description', 'images'];

function sanitizeProductInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;

  const payload = {};
  for (const field of productFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  }

  for (const field of ['price', 'stock']) {
    if (payload[field] !== undefined && payload[field] !== '') {
      payload[field] = Number(payload[field]);
    }
  }

  if (payload.offerPrice !== undefined && payload.offerPrice !== null && payload.offerPrice !== '') {
    payload.offerPrice = Number(payload.offerPrice);
  } else if (payload.offerPrice === '') {
    payload.offerPrice = null;
  }

  if (payload.images !== undefined &&
      (!Array.isArray(payload.images) || payload.images.length > 10 ||
       payload.images.some((image) => typeof image !== 'string' || image.length > 2048))) {
    return null;
  }

  return payload;
}

function hasValidPricing(payload, existing = {}) {
  const price = payload.price ?? existing.price;
  const offerPrice = payload.offerPrice === null
    ? undefined
    : payload.offerPrice ?? existing.offerPrice;

  return Number.isFinite(price) && price >= 0 &&
    (offerPrice == null || (Number.isFinite(offerPrice) && offerPrice >= 0 && offerPrice <= price));
}

// Public product listing with optional category, search, and sort filters.
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    const query = {};

    if (typeof category === 'string' && category.trim() && category !== 'all') {
      query.category = { $regex: escapeRegex(category.trim().slice(0, 60)), $options: 'i' };
    }

    if (typeof search === 'string' && search.trim()) {
      const term = { $regex: escapeRegex(search.trim().slice(0, 100)), $options: 'i' };
      query.$or = [
        { name: term },
        { category: term },
        { description: term }
      ];
    }

    const sort = {
      'price-low': { offerPrice: 1, price: 1 },
      'price-high': { offerPrice: -1, price: -1 },
      name: { name: 1 }
    }[sortBy] || { name: 1 };

    const products = await Product.find(query).sort(sort).limit(200).lean();
    res.json(products);
  } catch (error) {
    console.error('Product listing failed:', error);
    res.status(500).json({ message: 'Unable to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Product lookup failed:', error);
    res.status(500).json({ message: 'Unable to fetch product' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const payload = sanitizeProductInput(req.body);
  if (!payload) {
    return res.status(400).json({ message: 'Invalid product payload' });
  }
  if (!hasValidPricing(payload)) {
    return res.status(400).json({ message: 'Price must be non-negative and offer price cannot exceed price' });
  }

  try {
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product data', details: error.message });
    }
    console.error('Product creation failed:', error);
    res.status(500).json({ message: 'Unable to create product' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  const payload = sanitizeProductInput(req.body);
  if (!payload) {
    return res.status(400).json({ message: 'Invalid product payload' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!hasValidPricing(payload, product)) {
      return res.status(400).json({ message: 'Price must be non-negative and offer price cannot exceed price' });
    }

    Object.assign(product, payload);
    await product.save();
    res.json(product);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product data', details: error.message });
    }
    console.error('Product update failed:', error);
    res.status(500).json({ message: 'Unable to update product' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion failed:', error);
    res.status(500).json({ message: 'Unable to delete product' });
  }
});

module.exports = router;
