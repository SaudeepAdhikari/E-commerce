import React from 'react';
import './StorySection.css';

function StorySection() {
  return (
    <div className="story-section">
      <div className="story-content">
        <div className="story-text">
          <h2>Our Tea Story</h2>
          <p className="story-intro">
            Welcome to our journey of passion, tradition, and exceptional tea craftsmanship.
          </p>
          <div className="story-timeline">
            <div className="timeline-item">
              <h3>Our Beginning</h3>
              <p>Founded in 2010, we started with a simple mission: to bring the finest teas from around the world to tea enthusiasts everywhere.</p>
            </div>
            <div className="timeline-item">
              <h3>Our Commitment</h3>
              <p>We work directly with tea farmers and estates to ensure the highest quality and sustainable practices in tea production.</p>
            </div>
            <div className="timeline-item">
              <h3>Our Promise</h3>
              <p>Every cup of tea we serve is a testament to our dedication to quality, authenticity, and the art of tea making.</p>
            </div>
          </div>
        </div>
        <div className="story-image">
          <img 
            src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Tea plantation" 
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default StorySection; 