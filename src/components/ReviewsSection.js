import React, { useState } from 'react';
import './ReviewsSection.css';
import StarRating from './StarRating';
import ProductReviewsStats from './ProductReviewsStats';

function ReviewsSection({ productId, initialReviews = [], onAddReview }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    author: '',
    comment: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newReview.author.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!newReview.comment.trim()) {
      setError('Please enter your review');
      return;
    }

    const reviewToAdd = {
      ...newReview,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      productId
    };

    // Add the new review to the list
    const updatedReviews = [...reviews, reviewToAdd];
    setReviews(updatedReviews);

    // Call the parent component's handler if provided
    if (onAddReview) {
      onAddReview(reviewToAdd);
    }

    // Reset the form
    setNewReview({
      rating: 5,
      author: '',
      comment: '',
    });
    setError('');
    setShowForm(false);
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <button 
          className="write-review-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Reviews statistics */}
      {reviews.length > 0 && (
        <ProductReviewsStats reviews={reviews} />
      )}

      {showForm && (
        <div className="review-form-container">
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label>Your Rating</label>
              <StarRating 
                rating={newReview.rating} 
                interactive={true} 
                onChange={(rating) => setNewReview({...newReview, rating})} 
                size="large"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Your Name</label>
              <input
                type="text"
                id="author"
                value={newReview.author}
                onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="comment">Your Review</label>
              <textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Tell others what you think about this product"
                rows="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-review-btn">Submit Review</button>
          </form>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">Be the first to review this product!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <h4>{review.author}</h4>
                <span className="review-date">{review.date}</span>
              </div>
              <StarRating rating={review.rating} size="small" />
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewsSection;
