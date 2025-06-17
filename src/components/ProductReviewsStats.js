import React from 'react';
import './ProductReviewsStats.css';
import StarRating from './StarRating';

function ProductReviewsStats({ reviews }) {
  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Count reviews by star rating
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  // Calculate percentages for the progress bars
  const ratingPercentages = ratingCounts.map(count => 
    reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
  );

  return (
    <div className="reviews-stats">
      <div className="avg-rating">
        <div className="avg-rating-number">{avgRating}</div>
        <div>
          <StarRating rating={parseFloat(avgRating)} size="medium" />
          <div className="total-reviews">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</div>
        </div>
      </div>

      <div className="rating-bars">
        {[5, 4, 3, 2, 1].map((stars, index) => (
          <div key={stars} className="rating-bar-row">
            <div className="stars-label">{stars} stars</div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${ratingPercentages[stars - 1]}%` }}
              ></div>
            </div>
            <div className="rating-count">{ratingCounts[stars - 1]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviewsStats;
