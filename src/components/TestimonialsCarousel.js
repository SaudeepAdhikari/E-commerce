import React, { useState } from 'react';
import './TestimonialsCarousel.css';

const testimonials = [
  {
    text: '“Excellent Tea for the Price. You can tell that each batch is made with love and care.”',
    author: 'Mari Miller',
    stars: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bg: 'linear-gradient(135deg, #e0ffe0 0%, #a8e063 100%)'
  },
  {
    text: '“Amazing tea, Amazing Company! The quality is unsurpassed and the service is wonderful.”',
    author: 'A.M.',
    stars: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bg: 'linear-gradient(135deg, #fffbe0 0%, #f7b731 100%)'
  },
  {
    text: '“Wonderful Spiced Black Tea for Hot and Iced Beverages. My go-to blend for guests and personal consumption.”',
    author: 'Maria Grimald',
    stars: 5,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    bg: 'linear-gradient(135deg, #e0f7fa 0%, #56ab2f 100%)'
  }
];

function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState('');
  const [nextIdx, setNextIdx] = useState(null);

  const handleChange = (direction) => {
    const newIdx = (idx + (direction === 'left' ? -1 : 1) + testimonials.length) % testimonials.length;
    setNextIdx(newIdx);
    setAnim(direction === 'left' ? 'slide-left-out' : 'slide-right-out');
    setTimeout(() => {
      setIdx(newIdx);
      setAnim(direction === 'left' ? 'slide-left-in' : 'slide-right-in');
      setTimeout(() => {
        setAnim('');
        setNextIdx(null);
      }, 350);
    }, 350);
  };

  return (
    <div className="testimonials-carousel">
      <button className="carousel-arrow" onClick={() => handleChange('left')}>&lt;</button>
      <div className="testimonial-carousel-wrapper">
        <div className={`testimonial-card ${anim} ${nextIdx !== null ? 'is-animating' : ''}`} style={{ background: testimonials[nextIdx !== null ? nextIdx : idx].bg }}>
          <img className="testimonial-avatar" src={testimonials[nextIdx !== null ? nextIdx : idx].avatar} alt={testimonials[nextIdx !== null ? nextIdx : idx].author} />
          <div className="testimonial-stars">{'★'.repeat(testimonials[nextIdx !== null ? nextIdx : idx].stars)}</div>
          <p className="testimonial-text">{testimonials[nextIdx !== null ? nextIdx : idx].text}</p>
          <span className="testimonial-author">- {testimonials[nextIdx !== null ? nextIdx : idx].author}</span>
        </div>
      </div>
      <button className="carousel-arrow" onClick={() => handleChange('right')}>&gt;</button>
    </div>
  );
}

export default TestimonialsCarousel;
