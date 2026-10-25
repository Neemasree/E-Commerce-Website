const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    const query = {};

    if (typeof category === 'string' && category.trim() && category !== 'all') {
      query.category = { $regex: escapeRegex(category.trim()), $options: 'i' };
    }

    if (typeof search === 'string' && search.trim()) {
      const term = { $regex: escapeRegex(search.trim()), $options: 'i' };
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

    const products = await Product.find(query).sort(sort).lean();
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
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid product data' });
    }
    console.error('Product creation failed:', error);
    res.status(500).json({ message: 'Unable to create product' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, strict: 'throw' }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'StrictModeError') {
      return res.status(400).json({ message: 'Invalid product data' });
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
