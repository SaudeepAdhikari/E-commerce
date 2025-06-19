import React, { useState, useEffect } from 'react';
import './UserManagement.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetch('http://localhost:5000/api/users?admin=1')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(() => setUsers([]));
    }, []);

    const handleEdit = (user) => {
        setEditUser(user);
        setEditForm({ ...user });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSave = () => {
        setUsers(users.map(u => u.id === editUser.id ? { ...editForm } : u));
        setEditUser(null);
    };

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== userId));
            setSelectedUser(null);
        }
    };

    const handleBlock = (userId) => {
        setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' } : u));
    };

    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    const UserDetails = ({ user }) => {
        if (!user) return null;
        return (
            <div className="user-details">
                <h3>User Details</h3>
                <div className="user-info">
                    <div className="info-group"><label>Name:</label><span>{user.name}</span></div>
                    <div className="info-group"><label>Email:</label><span>{user.email}</span></div>
                    <div className="info-group"><label>Phone:</label><span>{user.phone}</span></div>
                    <div className="info-group"><label>Address:</label><span>{user.address}</span></div>
                    <div className="info-group"><label>Member Since:</label><span>{new Date(user.joinDate).toLocaleDateString()}</span></div>
                    <div className="info-group"><label>Role:</label><span>{user.role}</span></div>
                    <div className="info-group"><label>Status:</label><span>{user.status}</span></div>
                    <div className="info-group"><label>Total Orders:</label><span>{user.orders.length}</span></div>
                    <div className="info-group"><label>Total Spent:</label><span>${user.totalSpent.toFixed(2)}</span></div>
                </div>
                <div className="order-history">
                    <h4>Order History</h4>
                    {user.orders.length === 0 ? (
                        <p className="no-orders">No orders found</p>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td>${order.total.toFixed(2)}</td>
                                        <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="user-reviews">
                    <h4>Reviews</h4>
                    {user.reviews.length === 0 ? (
                        <p className="no-orders">No reviews found</p>
                    ) : (
                        <ul>
                            {user.reviews.map(r => (
                                <li key={r.id}><b>{r.product}</b>: {r.comment} (Rating: {r.rating})</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="user-actions">
                    <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                    <button className="block-btn" onClick={() => handleBlock(user.id)}>{user.status === 'Blocked' ? 'Unblock' : 'Block'}</button>
                    <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)} className="role-select">
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <div className="user-management">
            <h2>User Management</h2>
            <div className="users-container">
                <div className="users-list">
                    {users.length === 0 ? (
                        <p className="no-users">No users available</p>
                    ) : (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Registration Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.address}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {selectedUser && (
                    <div className="user-details-container">
                        <UserDetails user={selectedUser} />
                        <button className="close-btn" onClick={() => setSelectedUser(null)}>Close</button>
                    </div>
                )}
                {editUser && (
                    <div className="user-details-container">
                        <h3>Edit User</h3>
                        <div className="user-info">
                            <div className="info-group"><label>Name:</label><input name="name" value={editForm.name} onChange={handleEditChange} /></div>
                            <div className="info-group"><label>Email:</label><input name="email" value={editForm.email} onChange={handleEditChange} /></div>
                            <div className="info-group"><label>Phone:</label><input name="phone" value={editForm.phone} onChange={handleEditChange} /></div>
                            <div className="info-group"><label>Address:</label><input name="address" value={editForm.address} onChange={handleEditChange} /></div>
                        </div>
                        <div className="user-actions">
                            <button className="save-btn" onClick={handleEditSave}>Save</button>
                            <button className="close-btn" onClick={() => setEditUser(null)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserManagement; 