import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MiniCart.css';

function MiniCart({ cart, cartTotal, removeFromCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemRemoved, setItemRemoved] = useState(null);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  // Load cart from local storage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      // Assuming cart prop can be updated externally, you might need a setCart function passed down
      // For now, we'll assume the parent component manages the primary cart state
      // If MiniCart is the source of truth for the cart, this logic needs to be in a parent component or context
      // However, we will use this effect to illustrate loading if this component were the source
      console.log("Loaded cart from local storage:", JSON.parse(storedCart));
      // You would typically call a setCart function here if it were available
    }
  }, []);

  // Save cart to local storage whenever the cart prop changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);


  // Show mini cart after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        if (isOpen) {
          setIsAnimating(true);
          setTimeout(() => {
            setIsOpen(false);
            setIsAnimating(false);
          }, 300);
        }
      }
    };

    // Initial check in case page is already scrolled
    if (window.scrollY > 150) {
      setIsVisible(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Close mini cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && cartRef.current && !cartRef.current.contains(e.target)) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsAnimating(false);
        }, 300);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle item removal animation and update local storage
  const handleRemoveItem = (index) => {
    setItemRemoved(index);
    setTimeout(() => {
      removeFromCart(index);
      // Save updated cart to local storage after removal
      // This assumes removeFromCart updates the cart prop, which triggers the other useEffect
      setItemRemoved(null);
    }, 300);
  };

  // Don't render if cart is empty
  if (cart.length === 0) return null;

  // Toggle cart open/close with animation - This functionality might be removed or changed if the mini-cart display is removed
  const toggleCart = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="mini-cart-content">
      <div className="mini-cart-header">
        <h4>Your Cart <span className="cart-item-count">({cart.length})</span></h4>
        <button
          className="view-cart-btn"
          onClick={() => navigate('/cart')}
        >
          View Full Cart
        </button>
      </div>
      <div className="mini-cart-items">
        {cart.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`mini-cart-item ${itemRemoved === index ? 'removing' : ''}`}
          >
            <div className="item-image-container">
              <img
                src={item.image}
                alt={item.name}
                className="mini-cart-item-img"
                onClick={() => navigate(`/product/${item.id}`)}
              />
            </div>
            <div className="mini-cart-item-details">
              <div
                className="mini-cart-item-name"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                {item.name}
              </div>
              <div className="mini-cart-item-price">${item.price.toFixed(2)}</div>
            </div>
            <button
              className="mini-cart-remove-btn"
              onClick={() => handleRemoveItem(index)}
              aria-label="Remove item"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="mini-cart-footer">
        <div className="mini-cart-total">
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <button
          className="checkout-btn"
          onClick={() => {
            navigate('/checkout');
            setIsOpen(false);
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default MiniCart;