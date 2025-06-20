import React, { useState, useEffect } from 'react';
import './OrderManagement.css';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/orders?admin=1');
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                setOrders([]);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}?admin=1`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setOrders(prev => prev.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
            }
        } catch { }
    };

    const handleDelete = async (orderId) => {
        if (!window.confirm('Delete this order?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}?admin=1`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setOrders(prev => prev.filter(order => order._id !== orderId));
                setSelectedOrder(null);
            }
        } catch { }
    };

    const OrderDetails = ({ order }) => {
        if (!order) return null;

        return (
            <div className="order-details">
                <h3>Order Details</h3>
                <div className="order-info">
                    <div className="info-group">
                        <label>Order ID:</label>
                        <span>{order._id}</span>
                    </div>
                    <div className="info-group">
                        <label>Customer Name:</label>
                        <span>{order.name}</span>
                    </div>
                    <div className="info-group">
                        <label>Email:</label>
                        <span>{order.email}</span>
                    </div>
                    <div className="info-group">
                        <label>Shipping Address:</label>
                        <span>{order.address}</span>
                    </div>
                    <div className="info-group">
                        <label>Order Date:</label>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="info-group">
                        <label>Total Amount:</label>
                        <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="info-group">
                        <label>Status:</label>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="status-select"
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div className="order-items">
                    <h4>Order Items</h4>
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(order._id)} style={{ marginTop: 12 }}>Delete Order</button>
            </div>
        );
    };

    return (
        <div className="order-management">
            <h2>Order Management</h2>

            <div className="orders-container">
                <div className="orders-list">
                    {orders.length === 0 ? (
                        <p className="no-orders">No orders available</p>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>#{order._id}</td>
                                        <td>{order.name}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>${order.total.toFixed(2)}</td>
                                        <td>
                                            <span className={`status-badge ${order.status}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="view-btn"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                View Details
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(order._id)}
                                                style={{ marginLeft: 8 }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {selectedOrder && (
                    <div className="order-details-container">
                        <OrderDetails order={selectedOrder} />
                        <button
                            className="close-btn"
                            onClick={() => setSelectedOrder(null)}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderManagement; 