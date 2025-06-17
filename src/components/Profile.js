import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile({ user, onLogin, onLogout, onRegister }) {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            if (isLogin) {
                await onLogin(formData.email, formData.password);
            } else {
                await onRegister(formData.name, formData.email, formData.password);
            }
            navigate('/profile');
        } catch (err) {
            setError(err.message);
        }
    };

    if (user) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <h2>Welcome, {user.name}!</h2>
                    <div className="profile-info">
                        <div className="info-group">
                            <label>Email:</label>
                            <span>{user.email}</span>
                        </div>
                        <div className="info-group">
                            <label>Member Since:</label>
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button className="edit-profile-btn">Edit Profile</button>
                        <button className="logout-btn" onClick={onLogout}>Logout</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
                    <button
                        className="toggle-auth-btn"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your name"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="Confirm your password"
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-btn">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile; 