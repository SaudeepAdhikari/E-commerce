import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingCart.css';

function FloatingCart({ cart }) {
    const navigate = useNavigate();
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <button
            className="floating-cart-btn"
            onClick={() => navigate('/cart')}
            aria-label={`View cart (${itemCount} items)`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {itemCount > 0 && (
                <span className="cart-count">{itemCount}</span>
            )}
        </button>
    );
}

export default FloatingCart; 