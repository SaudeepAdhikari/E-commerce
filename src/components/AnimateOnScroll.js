// AnimateOnScroll.js
import React, { useEffect, useRef } from 'react';

function AnimateOnScroll({ children, animation = 'fade-in', delay = 0, duration = 700, as = 'div', className = '', ...props }) {
  const ref = useRef();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleScroll = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        node.classList.add('aos-animate');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`aos-init aos-${animation} ${className}`}
      style={{ transitionDelay: delay + 'ms', transitionDuration: duration + 'ms' }}
      {...props}
    >
      {children}
    </Tag>
  );
}
export default AnimateOnScroll;
