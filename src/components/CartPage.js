import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

function CartPage({ cart, removeFromCart, cartTotal, updateQuantity }) {
  const navigate = useNavigate();

  const handleRemoveItem = (cartId) => {
    // Add a small delay for animation
    const item = document.querySelector(`[data-cart-id="${cartId}"]`);
    if (item) {
      item.classList.add('removing');
      setTimeout(() => {
        removeFromCart(cartId);
      }, 300);
    } else {
      removeFromCart(cartId);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-title">Your Cart</div>
      {cart.length === 0 ? (
        <div className="cart-empty">
          <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" className="cart-empty-img" loading="lazy" />
          <p>Your cart is empty.<br />Start adding your favorite teas!</p>
          <button className="cart-checkout-btn" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div
                className="cart-item"
                key={item.cartId}
                data-cart-id={item.cartId}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                  loading="lazy"
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="cart-item-info">
                  <div
                    className="cart-item-title"
                    onClick={() => navigate(`/product/${item._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.name}
                  </div>
                  <div className="cart-item-desc">{item.description}</div>
                  <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  <div className="cart-item-qty">
                    <button className="cart-qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)} aria-label="Decrease quantity">-</button>
                    <span>{item.quantity}</span>
                    <button className="cart-qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemoveItem(item.cartId)}
                  title="Remove"
                  aria-label="Remove item"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-summary-label">Total:</div>
            <div className="cart-summary-value">${cartTotal.toFixed(2)}</div>
            <button
              className="cart-checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
