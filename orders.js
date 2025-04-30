const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../../models/Product');

// Customer Routes
// Get customer's orders
router.get('/customer/:email', async (req, res) => {
    try {
        const orders = await Order.find({ customerEmail: req.params.email })
            .populate('items.productId')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new order from cart
router.post('/customer/create', async (req, res) => {
    try {
        const { sessionId, customerDetails, paymentMethod } = req.body;
        
        // Get cart items
        const cart = await Cart.findOne({ sessionId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);

        // Create order
        const order = new Order({
            customerName: customerDetails.name,
            customerEmail: customerDetails.email,
            customerPhone: customerDetails.phone,
            deliveryAddress: customerDetails.address,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            })),
            totalAmount,
            paymentMethod,
            status: 'pending',
            paymentStatus: paymentMethod === 'cash' ? 'pending' : 'processing'
        });

        const newOrder = await order.save();

        // Clear cart
        await Cart.findOneAndDelete({ sessionId });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin Routes
// Get all orders
router.get('/admin', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.productId')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single order
router.get('/admin/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.patch('/admin/:id/status', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = req.body.status;
        if (req.body.status === 'delivered') {
            order.deliveryDate = new Date();
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update payment status
router.patch('/admin/:id/payment', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.paymentStatus = req.body.paymentStatus;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete order
router.delete('/admin/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.deleteOne();
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 