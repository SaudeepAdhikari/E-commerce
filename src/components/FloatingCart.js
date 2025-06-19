import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FloatingCart.css';

function FloatingCart({ cart }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className={`floating-cart ${isExpanded ? 'expanded' : ''}`}>
            <button
                className="floating-cart-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Collapse cart" : "Expand cart"}
            >
                <i className="fas fa-shopping-cart"></i>
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </button>

            <div className="floating-cart-content">
                <div className="floating-cart-header">
                    <h3>Your Cart</h3>
                    <button
                        className="close-cart"
                        onClick={() => setIsExpanded(false)}
                        aria-label="Close cart"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty</p>
                        <Link to="/products" className="continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.map(item => (
                                <div key={item.cartId} className="cart-item">
                                    <img src={item.image} alt={item.name} className="item-image" />
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                        <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Total Items:</span>
                                <span>{itemCount}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <Link to="/cart" className="view-cart-btn">
                                View Cart
                            </Link>
                            <Link to="/checkout" className="checkout-btn">
                                Checkout
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default FloatingCart; 