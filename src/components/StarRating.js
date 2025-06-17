import React, { useState } from 'react';
import './StarRating.css';

function StarRating({ rating, interactive = false, onChange, size = 'medium' }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating || 0);

  const handleClick = (starIndex) => {
    if (!interactive) return;

    const newRating = starIndex + 1;
    setSelectedRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  const handleMouseEnter = (starIndex) => {
    if (!interactive) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const currentRating = interactive ? (hoverRating || selectedRating) : rating;

  return (
    <div className={`star-rating ${size} ${interactive ? 'interactive' : ''}`}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`star ${index < currentRating ? 'filled' : 'empty'}`}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          {index < currentRating ? '★' : '☆'}
        </span>
      ))}
      {interactive && <span className="rating-text">{hoverRating || selectedRating || ''}</span>}
    </div>
  );
}

export default StarRating;
