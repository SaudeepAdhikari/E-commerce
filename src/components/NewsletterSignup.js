import React from 'react';
import '../newsletter.css';
import RippleButton from './RippleButton';

function NewsletterSignup() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate API call
    try {
      // Replace with your real API endpoint
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  if (submitted) return <div className="newsletter-success">Thank you for subscribing! 🎉</div>;
  return (
    <form className="newsletter-signup" onSubmit={handleSubmit}>
      <h3>Subscribe to our Newsletter</h3>
      <p>Get exclusive offers, new arrivals, and tea tips in your inbox.</p>
      <div className="newsletter-inputs">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <RippleButton type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </RippleButton>
      </div>
      {error && <div className="newsletter-error">{error}</div>}
    </form>
  );
}

export default NewsletterSignup;
