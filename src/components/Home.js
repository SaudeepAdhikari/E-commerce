import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to Tea Shop</h1>
                    <p>Discover our premium collection of fine teas</p>
                    <Link to="/products" className="cta-button">
                        Shop Now
                    </Link>
                </div>
            </section>

            <section className="features">
                <div className="feature">
                    <i className="feature-icon">🌿</i>
                    <h3>Premium Quality</h3>
                    <p>Handpicked tea leaves from the finest gardens</p>
                </div>
                <div className="feature">
                    <i className="feature-icon">🚚</i>
                    <h3>Fast Shipping</h3>
                    <p>Free shipping on orders over $50</p>
                </div>
                <div className="feature">
                    <i className="feature-icon">💚</i>
                    <h3>100% Natural</h3>
                    <p>No artificial flavors or preservatives</p>
                </div>
            </section>

            <section className="categories">
                <h2>Shop by Category</h2>
                <div className="category-grid">
                    <Link to="/products?category=green" className="category-card">
                        <img src="https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Green Tea" />
                        <h3>Green Tea</h3>
                    </Link>
                    <Link to="/products?category=black" className="category-card">
                        <img src="https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Black Tea" />
                        <h3>Black Tea</h3>
                    </Link>
                    <Link to="/products?category=herbal" className="category-card">
                        <img src="https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Herbal Tea" />
                        <h3>Herbal Tea</h3>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home; 