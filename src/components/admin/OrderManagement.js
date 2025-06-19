import React, { useState } from 'react';
import './OrderManagement.css';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const OrderDetails = ({ order }) => {
        if (!order) return null;

        return (
            <div className="order-details">
                <h3>Order Details</h3>
                <div className="order-info">
                    <div className="info-group">
                        <label>Order ID:</label>
                        <span>{order.id}</span>
                    </div>
                    <div className="info-group">
                        <label>Customer Name:</label>
                        <span>{order.customerName}</span>
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
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="info-group">
                        <label>Total Amount:</label>
                        <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="info-group">
                        <label>Status:</label>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
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
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.customerName}</td>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
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