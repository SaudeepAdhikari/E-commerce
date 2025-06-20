import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

const OrderHistory = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setOrdersLoading(true);
            setOrdersError('');
            const token = localStorage.getItem('token');
            if (!token) return setOrdersLoading(false);
            try {
                const res = await fetch('http://localhost:5000/api/orders/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch orders');
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                setOrdersError('Could not load order history.');
            }
            setOrdersLoading(false);
        };
        fetchOrders();
    }, []);

    return (
        <div className="profile-modern-orders" style={{ maxWidth: 700, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24 }}>
            <h2>Order History</h2>
            {ordersLoading ? (
                <div>Loading orders...</div>
            ) : ordersError ? (
                <div className="error-msg">{ordersError}</div>
            ) : orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse', background: '#fafbfc' }}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}</td>
                                <td>
                                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                                        {order.items.map((item, idx) => (
                                            <li key={idx}>{item.name} x{item.quantity}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>${order.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory; 