import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart({ cart, removeFromCart, updateQuantity, cartTotal }) {
    console.log('Cart component render:', { cart, cartTotal });

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your cart is empty</h2>
                <p>Add some tea to your cart to get started!</p>
                <Link to="/products" className="continue-shopping-btn">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item.cartId} className="cart-item">
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="cart-item-total">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <button
                                className="remove-btn"
                                onClick={() => removeFromCart(item.cartId)}
                                aria-label="Remove item"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <Link to="/checkout" className="checkout-btn">
                        Proceed to Checkout
                    </Link>
                    <Link to="/products" className="continue-shopping-link">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart; 