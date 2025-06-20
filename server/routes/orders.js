const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth } = require('./users');

// Create a new order
router.post('/', auth, async (req, res) => {
    const { name, email, address, items, total } = req.body;
    if (!name || !email || !address || !items || !Array.isArray(items) || items.length === 0 || !total) {
        return res.status(400).json({ error: 'All fields are required and cart cannot be empty.' });
    }
    try {
        const orderData = { name, email, address, items, total };
        if (req.user && req.user.userId) {
            orderData.user = req.user.userId;
        }
        const order = new Order(orderData);
        await order.save();
        res.status(201).json({ orderId: order._id });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user's orders
router.get('/my', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update order status (admin only, demo: allow if ?admin=1)
router.put('/:id', async (req, res) => {
    if (req.query.admin !== '1') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (status) order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete order (admin only, demo: allow if ?admin=1)
router.delete('/:id', async (req, res) => {
    if (req.query.admin !== '1') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ msg: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 