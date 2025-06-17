// RippleButton.js
import React, { useRef } from 'react';
import './ripplebutton.css';

function RippleButton({ children, className = '', onClick, ...props }) {
  const btnRef = useRef();
  function createRipple(e) {
    const button = btnRef.current;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
  }
  return (
    <button
      ref={btnRef}
      className={`ripple-btn ${className}`}
      onClick={e => {
        createRipple(e);
        if (onClick) onClick(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
export default RippleButton;
