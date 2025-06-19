import React, { useState, useEffect } from 'react';
import './TestimonialsCarousel.css';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Tea Enthusiast",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    text: "The quality of Demaj Tea is exceptional. Every cup brings a moment of tranquility to my day.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Food Blogger",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    text: "As someone who reviews tea products professionally, I can confidently say that Demaj Tea stands out for its premium quality and authentic flavors.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Yoga Instructor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    text: "I recommend Demaj Tea to all my yoga students. It's the perfect companion for mindfulness practice.",
    rating: 5
  }
];

function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % testimonials.length
    );
  };

  return (
    <div className="testimonials-carousel">
      <div className="carousel-container">
        <button
          className="carousel-button prev"
          onClick={handlePrevClick}
          aria-label="Previous testimonial"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="testimonial-card">
          <div className="testimonial-image">
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
              loading="lazy"
            />
          </div>
          <div className="testimonial-content">
            <div className="testimonial-rating">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
            <p className="testimonial-text">{testimonials[currentIndex].text}</p>
            <div className="testimonial-author">
              <h4>{testimonials[currentIndex].name}</h4>
              <p>{testimonials[currentIndex].role}</p>
            </div>
          </div>
        </div>

        <button
          className="carousel-button next"
          onClick={handleNextClick}
          aria-label="Next testimonial"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="carousel-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialsCarousel;
