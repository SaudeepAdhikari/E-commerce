import React, { useState, useEffect } from 'react';
import './ReviewsSection.css';
import StarRating from './StarRating';
import ProductReviewsStats from './ProductReviewsStats';
import { useNavigate } from 'react-router-dom';

function ReviewsSection({ productId, user }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    author: user && user.name ? user.name : '',
    comment: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setReviews([]);
      }
      setLoading(false);
    }
    if (productId) fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (user && user.name) {
      setNewReview(r => ({ ...r, author: user.name }));
    }
  }, [user]);

  // Check if the current user (by name) has already reviewed
  const userReviewIdx = reviews.findIndex(r => r.author.trim().toLowerCase() === newReview.author.trim().toLowerCase());

  const handleDeleteReview = async (reviewIdx) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews/${reviewIdx}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews => reviews.filter((_, idx) => idx !== reviewIdx));
      }
    } catch (err) { }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.author.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!newReview.comment.trim()) {
      setError('Please enter your review');
      return;
    }
    if (userReviewIdx !== -1) {
      setError('You have already submitted a review for this product.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to submit review');
      } else {
        const addedReview = await res.json();
        setReviews([...reviews, addedReview]);
        setShowForm(false);
        setNewReview({ rating: 5, author: '', comment: '' });
      }
    } catch (err) {
      setError('Failed to submit review');
    }
    setSubmitting(false);
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        {user && user.name ? (
          <button
            className="write-review-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        ) : (
          <button
            className="write-review-btn"
            onClick={() => navigate('/profile')}
          >
            Log in to Write a Review
          </button>
        )}
      </div>
      {loading ? (
        <div>Loading reviews...</div>
      ) : reviews.length > 0 && (
        <ProductReviewsStats reviews={reviews} />
      )}
      {showForm && user && user.name && (
        <div className="review-form-container">
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <label>Your Rating</label>
                <StarRating
                  rating={newReview.rating}
                  interactive={true}
                  onChange={(rating) => setNewReview({ ...newReview, rating })}
                  size="large"
                />
              </div>
            </div>
            <div className="form-group">
              {/* Only show name input if not logged in */}
              {user && user.name ? (
                <label htmlFor="author">Your Name: <b>{user.name}</b></label>
              ) : (
                <>
                  <label htmlFor="author">Your Name</label>
                  <input
                    type="text"
                    id="author"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    placeholder="Enter your name"
                    disabled={submitting}
                  />
                </>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="comment">Your Review</label>
              <textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Tell others what you think about this product"
                rows="4"
                disabled={submitting}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-review-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
      <div className="reviews-list">
        {loading ? null : reviews.length === 0 ? (
          <p className="no-reviews">Be the first to review this product!</p>
        ) : (
          reviews.map((review, idx) => {
            const isOwnReview = review.author.trim().toLowerCase() === newReview.author.trim().toLowerCase() && newReview.author.trim() !== '';
            return (
              <div key={review._id || review.date || idx} className="review-item" style={{ position: 'relative' }}>
                <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ margin: 0 }}>{review.author}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="review-date">{review.date ? (new Date(review.date)).toLocaleDateString() : ''}</span>
                    {isOwnReview && (
                      <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }} onClick={() => handleDeleteReview(idx)}>Delete</button>
                    )}
                  </div>
                </div>
                <StarRating rating={review.rating} size="small" />
                <p className="review-comment">{review.comment}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ReviewsSection;
