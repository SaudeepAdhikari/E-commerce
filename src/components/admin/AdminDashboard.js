import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import UserManagement from './UserManagement';
import AdminReviews from './AdminReviews';

function AdminDashboard({ products = [], onLogout, onDeleteProduct }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [userCount, setUserCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/users?admin=1')
            .then(res => res.json())
            .then(data => setUserCount(Array.isArray(data) ? data.length : 0))
            .catch(() => setUserCount(0));
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="dashboard-overview">
                        <h2>Welcome to Demaj Admin Dashboard</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Orders</h3>
                                <p className="stat-number">0</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Products</h3>
                                <p className="stat-number">{products.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <p className="stat-number">{userCount}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Revenue</h3>
                                <p className="stat-number">$0.00</p>
                            </div>
                        </div>
                    </div>
                );
            case 'products':
                return (
                    <div className="products-section">
                        <h2>Product Management</h2>
                        <button
                            className="add-product-btn"
                            onClick={() => navigate('/admin/products')}
                        >
                            Add New Product
                        </button>
                        <div className="products-list">
                            {products.length === 0 ? (
                                <p className="no-products">No products available</p>
                            ) : (
                                <table className="products-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product._id}>
                                                <td>
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="product-thumbnail"
                                                        onError={e => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/no-image.png';
                                                        }}
                                                    />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.category}</td>
                                                <td>${product.price}</td>
                                                <td>{product.stock}</td>
                                                <td>
                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => navigate('/admin/products')}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to delete this product?')) {
                                                                onDeleteProduct(product._id);
                                                            }
                                                        }}
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
                    </div>
                );
            case 'orders':
                return (
                    <div className="orders-section">
                        <h2>Order Management</h2>
                        <div className="orders-list">
                            <p>No orders available</p>
                        </div>
                    </div>
                );
            case 'users':
                return <UserManagement />;
            case 'reviews':
                return <AdminReviews />;
            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar enhanced-sidebar">
                <div className="admin-logo enhanced-logo">
                    <div className="demaj-logo-svg">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="24" r="24" fill="#2a5298" />
                            <text x="50%" y="56%" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold" fontFamily="Montserrat, Arial" dy=".3em">D</text>
                        </svg>
                    </div>
                    <h2>Demaj Admin</h2>
                </div>
                <div className="admin-avatar">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin Avatar" />
                    <div className="avatar-label">Admin</div>
                </div>
                <nav className="admin-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Products
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                </nav>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
            <div className="admin-content enhanced-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminDashboard; 