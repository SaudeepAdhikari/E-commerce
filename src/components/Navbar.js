import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ cartCount, user, onLogout }) {
    const [showSearch, setShowSearch] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => setShowDropdown(v => !v);
    const handleLogoutClick = () => {
        setShowDropdown(false);
        if (onLogout) onLogout();
        navigate('/');
    };

    useEffect(() => {
        if (!user) setShowDropdown(false);
    }, [user]);

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">Demaj Tea</Link>
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/products" className="nav-link">Tea Collection</Link>
                <Link to="/story" className="nav-link">Our Story</Link>
                <Link to="/cart" className="nav-link cart-link cart-btn">
                    Cart ({cartCount})
                </Link>
                <button
                    className="nav-link search-btn"
                    onClick={() => setShowSearch(!showSearch)}
                    aria-label="Search"
                >
                    <i className="fas fa-search"></i>
                </button>
                <div className="profile-dropdown-wrapper">
                    {user ? (
                        <button className="profile-icon-btn" onClick={handleProfileClick} aria-label="Profile">
                            <span role="img" aria-label="profile" style={{ fontSize: 24 }}>👤</span>
                        </button>
                    ) : (
                        <button className="login-btn" onClick={() => navigate('/profile')} aria-label="Login">
                            <span style={{ fontSize: 18, marginRight: 8 }}>🔑</span>Login
                        </button>
                    )}
                    {showDropdown && user && (
                        <div className="profile-dropdown-menu">
                            <button onClick={() => { setShowDropdown(false); navigate('/profile'); }}>My Profile</button>
                            <button onClick={() => { setShowDropdown(false); navigate('/order-history'); }}>Order History</button>
                            <button onClick={() => { setShowDropdown(false); navigate('/settings'); }}>Settings</button>
                            <button onClick={() => { setShowDropdown(false); navigate('/saved'); }}>Saved Items</button>
                            <button onClick={() => { setShowDropdown(false); navigate('/help'); }}>Help / Support</button>
                            <button onClick={handleLogoutClick}>Log Out</button>
                        </div>
                    )}
                    {showDropdown && !user && (
                        <div className="profile-dropdown-menu">
                            <button onClick={() => { setShowDropdown(false); navigate('/profile'); }}>Login</button>
                            <button onClick={() => { setShowDropdown(false); navigate('/profile?register=1'); }}>Register</button>
                            <button onClick={() => { setShowDropdown(false); navigate('/help'); }}>Help / Support</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar; 