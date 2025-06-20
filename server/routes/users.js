const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const crypto = require('crypto');

const router = express.Router();

// Register
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, phone = '', address = '', role = 'Customer', status = 'Active' } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, phone, address, role, status });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { userId: user._id, name: user.name, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: payload });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Auth middleware
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

// Get current user info
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update current user info
router.put('/me', auth, async (req, res) => {
    const { name, email, password, phone, address, role, status } = req.body;
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        if (email && email !== user.email) {
            // Check for duplicate email
            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ msg: 'Email already in use' });
            user.email = email;
        }
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (role) user.role = role;
        if (status) user.status = status;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        await user.save();
        res.json({ msg: 'Profile updated', user: { name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role, status: user.status, _id: user._id } });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'No user with that email' });
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        // In production, send email here. For now, return token in response.
        res.json({ msg: 'Password reset link sent', token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Reset password
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ msg: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all users (admin only, demo: allow if ?admin=1)
router.get('/', async (req, res) => {
    // In production, check req.user.isAdmin or similar
    if (req.query.admin !== '1') {
        return res.status(403).json({ msg: 'Forbidden' });
    }
    try {
        const users = await User.find({}, 'name email phone address role status createdAt');
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get current user's cart
router.get('/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('cart.product');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add or update an item in the cart
router.post('/cart', auth, async (req, res) => {
    const { product, quantity } = req.body;
    if (!product || !quantity || quantity < 1) {
        return res.status(400).json({ msg: 'Product and valid quantity are required' });
    }
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        const itemIndex = user.cart.findIndex(item => item.product.toString() === product);
        if (itemIndex > -1) {
            // Update quantity
            user.cart[itemIndex].quantity = quantity;
        } else {
            // Add new item
            user.cart.push({ product, quantity });
        }
        await user.save();
        await user.populate('cart.product');
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Remove an item from the cart
router.delete('/cart/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
        await user.save();
        await user.populate('cart.product');
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Clear the cart
router.delete('/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        user.cart = [];
        await user.save();
        res.json({ msg: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = { router, auth }; 