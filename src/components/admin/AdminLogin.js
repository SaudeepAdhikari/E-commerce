import React, { useState } from 'react';
import './AdminLogin.css';

function AdminLogin({ onLogin }) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt with:', credentials);
        // In a real application, this would be an API call to verify credentials
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            console.log('Credentials valid, calling onLogin');
            onLogin(true);
        } else {
            console.log('Invalid credentials');
            setError('Invalid username or password');
        }
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>Admin Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className={`form-group${credentials.username ? ' has-value' : ''}`}>
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={`form-group${credentials.password ? ' has-value' : ''}`}>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="admin-login-btn">Login</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin; 