import React from 'react';
import './CheckoutPage.css';

function CheckoutPage({ cart, cartTotal, user }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [progress, setProgress] = React.useState(33);
  const [error, setError] = React.useState('');
  const [orderId, setOrderId] = React.useState(null);
  const [form, setForm] = React.useState({
    name: user && user.name ? user.name : '',
    email: user && user.email ? user.email : '',
    address: user && user.address ? user.address : ''
  });

  React.useEffect(() => {
    // Always use the freshest user info
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setForm({
          name: data.name || '',
          email: data.email || '',
          address: data.address || ''
        });
      } catch { }
    };
    fetchUser();
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProgress(100);
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: form.address,
          items: cart.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: cartTotal
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      setOrderId(data.orderId || data._id || null);
      setTimeout(() => setSubmitted(true), 800);
    } catch (err) {
      setError(err.message || 'Order failed');
      setProgress(33);
    }
  };

  if (submitted) return (
    <div className="checkout-page">
      <div className="checkout-success">
        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success" className="checkout-success-img" />
        <h2 className="checkout-title">Thank you for your order!</h2>
        {orderId && <div className="checkout-order-id">Order #{orderId}</div>}
        <p>Your tea is on its way. You'll receive a confirmation email soon.</p>
        <div className="checkout-summary">
          <div className="checkout-summary-label">Order Total:</div>
          <div className="checkout-summary-value">${cartTotal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="checkout-title">Checkout</div>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label className="checkout-label">Name
          <input className="checkout-input" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" />
        </label>
        <label className="checkout-label">Email
          <input className="checkout-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" />
        </label>
        <label className="checkout-label">Address
          <input className="checkout-input" name="address" value={form.address} onChange={handleChange} required placeholder="Shipping address" />
        </label>
        <div className="checkout-items-list">
          <div className="checkout-items-title">Order Items:</div>
          {cart.length === 0 ? <div>No items in cart.</div> : (
            <ul>
              {cart.map(item => (
                <li key={item._id} className="checkout-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ flex: 2 }}>{item.name}</span>
                  <span style={{ flex: 1, textAlign: 'center' }}>x {item.quantity}</span>
                  <span style={{ flex: 1, textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="checkout-summary">
          <div className="checkout-summary-label">Order Total:</div>
          <div className="checkout-summary-value">${cartTotal.toFixed(2)}</div>
        </div>
        {error && <div className="checkout-error">{error}</div>}
        <button type="submit" className="checkout-btn">Place Order</button>
      </form>
    </div>
  );
}

export default CheckoutPage;
