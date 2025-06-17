import React from 'react';
import './CheckoutPage.css';

function CheckoutPage({ cart, cartTotal }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [progress, setProgress] = React.useState(33);
  const handleSubmit = (e) => {
    e.preventDefault();
    setProgress(100);
    setTimeout(() => setSubmitted(true), 800);
  };
  if (submitted) return (
    <div className="checkout-page">
      <div className="checkout-success">
        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success" className="checkout-success-img" />
        <h2 className="checkout-title">Thank you for your order!</h2>
        <p>Your tea is on its way. You'll receive a confirmation email soon.</p>
      </div>
    </div>
  );
  return (
    <div className="checkout-page">
      <div className="checkout-title">Checkout</div>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label className="checkout-label">Name
          <input className="checkout-input" required placeholder="Your full name" />
        </label>
        <label className="checkout-label">Email
          <input className="checkout-input" type="email" required placeholder="you@email.com" />
        </label>
        <label className="checkout-label">Address
          <input className="checkout-input" required placeholder="Shipping address" />
        </label>
        <div className="checkout-summary">
          <div className="checkout-summary-label">Order Total:</div>
          <div className="checkout-summary-value">${cartTotal.toFixed(2)}</div>
        </div>
        <button type="submit" className="checkout-btn">Place Order</button>
      </form>
    </div>
  );
}

export default CheckoutPage;
