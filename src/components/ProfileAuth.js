import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function ProfileAuth({ onLogin, onLogout, onRegister }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

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
                navigate('/');
            } else {
                await onRegister(formData.name, formData.email, formData.password, formData.phone, formData.address);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="profile-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label htmlFor="name">Name</label>
                        </div>
                    )}
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder=" "
                            autoComplete="off"
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label htmlFor="phone">Phone</label>
                        </div>
                    )}
                    {!isLogin && (
                        <div className="form-group">
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label htmlFor="address">Address</label>
                        </div>
                    )}
                    <div className="form-group" style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder=" "
                            autoComplete="off"
                            style={{ paddingRight: 40 }}
                        />
                        <label htmlFor="password">Password</label>
                        <span
                            className="eye-icon"
                            style={{ right: 12, top: 18, position: 'absolute', cursor: 'pointer' }}
                            onClick={() => setShowPassword(v => !v)}
                            tabIndex={0}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                placeholder=" "
                                autoComplete="off"
                                style={{ paddingRight: 40 }}
                            />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <span
                                className="eye-icon"
                                style={{ right: 12, top: 18, position: 'absolute', cursor: 'pointer' }}
                                onClick={() => setShowPassword(v => !v)}
                                tabIndex={0}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                    )}
                    <button type="submit" className="submit-btn" style={{ marginTop: 12 }}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <div className="signup-link">
                    {isLogin ? (
                        <>Have not account yet?<span onClick={() => { setIsLogin(false); setError(''); }}> SIGN UP</span></>
                    ) : (
                        <>Already have an account?<span onClick={() => { setIsLogin(true); setError(''); }}> LOGIN</span></>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileAuth; 