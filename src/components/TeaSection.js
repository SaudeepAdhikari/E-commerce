import React from 'react';
import './TeaSection.css';

function TeaSection({ products, addToCart }) {
    return (
        <div className="tea-section">
            <div className="section-header">
                <h2>Our Tea Collection</h2>
                <p>Discover our carefully curated selection of premium teas</p>
            </div>
            <div className="tea-list">
                {products.map((product) => (
                    <div key={product._id} className="tea-card">
                        <img src={product.image} alt={product.name} className="tea-card-image" />
                        <div className="tea-card-title">{product.name}</div>
                        <div className="tea-card-desc">{product.description}</div>
                        <div className="tea-card-price">${parseFloat(product.price).toFixed(2)}</div>
                        <button
                            className="tea-card-btn"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TeaSection; 