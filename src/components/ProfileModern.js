import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ProfileModern.css';
import { format } from 'date-fns';

const ProfileModern = ({ onLogout }) => {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
    const [pwdMsg, setPwdMsg] = useState('');
    const [pwdError, setPwdError] = useState('');
    const [showPwdForm, setShowPwdForm] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState('');

    // Show welcome message if present in location.state
    useEffect(() => {
        if (location.state && location.state.msg) {
            setMsg(location.state.msg);
            window.history.replaceState({}, document.title, location.pathname); // Clear state
            setTimeout(() => setMsg(''), 4000);
        }
    }, [location]);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) return setLoading(false);
            try {
                const res = await fetch('http://localhost:5000/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setUser(data);
                setForm({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || ''
                });
            } catch (err) {
                setError('Could not load profile.');
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

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

    const handleEdit = () => {
        setEditing(true);
        setMsg('');
        setError('');
    };

    const handleChange = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSave = async e => {
        e.preventDefault();
        setMsg('');
        setError('');
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Update failed');
            setUser(u => ({ ...u, ...form }));
            setEditing(false);
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 4000);
        } catch (err) {
            setError(err.message);
        }
    };

    // Password change logic
    const handlePwdChange = e => {
        setPwdForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };
    const handlePwdSubmit = async e => {
        e.preventDefault();
        setPwdMsg('');
        setPwdError('');
        if (pwdForm.next !== pwdForm.confirm) {
            setPwdError('New passwords do not match.');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ currentPassword: pwdForm.current, newPassword: pwdForm.next })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Password change failed');
            setPwdMsg('Password changed successfully!');
            setPwdForm({ current: '', next: '', confirm: '' });
            setShowPwdForm(false);
            setTimeout(() => setPwdMsg(''), 4000);
        } catch (err) {
            setPwdError(err.message);
        }
    };

    if (loading) return <div className="profile-modern-loading">Loading...</div>;

    return (
        <div className="profile-modern-container">
            <div className="profile-modern-card">
                <div className="profile-modern-avatar">
                    <span role="img" aria-label="avatar" style={{ fontSize: 64 }}>🧑‍💼</span>
                </div>
                {msg && <div className="success-msg">{msg}</div>}
                {editing ? (
                    <form className="profile-modern-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder=" " />
                            <label>Name</label>
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder=" " />
                            <label>Email</label>
                        </div>
                        <div className="form-group">
                            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder=" " />
                            <label>Phone</label>
                        </div>
                        <div className="form-group">
                            <input type="text" name="address" value={form.address} onChange={handleChange} placeholder=" " />
                            <label>Address</label>
                        </div>
                        <div className="profile-modern-actions">
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                        {msg && <div className="success-msg">{msg}</div>}
                        {error && <div className="error-msg">{error}</div>}
                    </form>
                ) : user ? (
                    <>
                        <div className="profile-modern-info">
                            <div className="profile-modern-info-row"><span className="info-icon">🧑</span><b>Name:</b> {user.name}</div>
                            <div className="profile-modern-info-row"><span className="info-icon">✉️</span><b>Email:</b> {user.email}</div>
                            <div className="profile-modern-info-row"><span className="info-icon">📞</span><b>Phone:</b> {user.phone}</div>
                            <div className="profile-modern-info-row"><span className="info-icon">🏠</span><b>Address:</b> {user.address}</div>
                        </div>
                        <div className="profile-modern-actions">
                            <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
                            <button className="logout-btn" onClick={onLogout}>Logout</button>
                            <button className="save-btn" onClick={() => setShowPwdForm(f => !f)} style={{ marginLeft: 8 }}>{showPwdForm ? 'Cancel Password Change' : 'Change Password'}</button>
                        </div>
                        {showPwdForm && (
                            <form className="profile-modern-form" onSubmit={handlePwdSubmit} style={{ marginTop: 16 }}>
                                <div className="form-group">
                                    <input type={showPwd ? 'text' : 'password'} name="current" value={pwdForm.current} onChange={handlePwdChange} required placeholder=" " />
                                    <label>Current Password</label>
                                </div>
                                <div className="form-group">
                                    <input type={showPwd ? 'text' : 'password'} name="next" value={pwdForm.next} onChange={handlePwdChange} required placeholder=" " />
                                    <label>New Password</label>
                                </div>
                                <div className="form-group">
                                    <input type={showPwd ? 'text' : 'password'} name="confirm" value={pwdForm.confirm} onChange={handlePwdChange} required placeholder=" " />
                                    <label>Confirm New Password</label>
                                </div>
                                <button type="button" className="cancel-btn" style={{ marginBottom: 8 }} onClick={() => setShowPwd(s => !s)}>{showPwd ? 'Hide' : 'Show'} Passwords</button>
                                <button type="submit" className="save-btn">Change Password</button>
                                {pwdMsg && <div className="success-msg">{pwdMsg}</div>}
                                {pwdError && <div className="error-msg">{pwdError}</div>}
                            </form>
                        )}
                        {msg && <div className="success-msg">{msg}</div>}
                        {error && <div className="error-msg">{error}</div>}
                    </>
                ) : <div className="error-msg">No user data.</div>}
            </div>
        </div>
    );
};

export default ProfileModern; 