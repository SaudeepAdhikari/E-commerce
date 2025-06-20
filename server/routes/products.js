const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Add a product
router.post('/', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

// Update a product
router.put('/:id', async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
});

// Delete a product
router.delete('/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// Image upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a review to a product
router.post('/:id/reviews', async (req, res) => {
    const { rating, author, comment } = req.body;
    console.log('Review POST body:', req.body);
    if (rating == null || author === undefined || author === '' || comment === undefined || comment === '') {
        console.log('Review POST error: missing fields');
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            console.log('Review POST error: product not found');
            return res.status(404).json({ error: 'Product not found' });
        }
        const review = {
            rating,
            author,
            comment,
            date: new Date()
        };
        product.reviews.push(review);
        await product.save();
        console.log('Review POST success, review added:', review);
        res.status(201).json(review);
    } catch (err) {
        console.log('Review POST server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all reviews for a product
router.get('/:id/reviews', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product.reviews);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a review from a product (by review index)
router.delete('/:id/reviews/:reviewIndex', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const idx = parseInt(req.params.reviewIndex, 10);
        if (isNaN(idx) || idx < 0 || idx >= product.reviews.length) {
            return res.status(400).json({ error: 'Invalid review index' });
        }
        product.reviews.splice(idx, 1);
        await product.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 