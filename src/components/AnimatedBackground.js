import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
    const containerRef = useRef(null);
    const leavesRef = useRef([]);

    useEffect(() => {
        const container = containerRef.current;
        const leaves = leavesRef.current;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = container.getBoundingClientRect();

            // Calculate mouse position relative to container
            const x = (clientX - left) / width;
            const y = (clientY - top) / height;

            // Move each leaf based on mouse position
            leaves.forEach((leaf, index) => {
                const speed = 0.05 + (index * 0.02); // Different speed for each leaf
                const moveX = (x - 0.5) * speed * 100;
                const moveY = (y - 0.5) * speed * 100;

                leaf.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.5}deg)`;
            });
        };

        container.addEventListener('mousemove', handleMouseMove);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="animated-background" ref={containerRef}>
            <img
                src="/leaf1.jpg"
                alt="Tea leaf 1"
                className="floating-leaf leaf1"
                ref={el => leavesRef.current[0] = el}
            />
            <img
                src="/leaf2.png"
                alt="Tea leaf 2"
                className="floating-leaf leaf2"
                ref={el => leavesRef.current[1] = el}
            />
            <img
                src="/leaf3.png"
                alt="Tea leaf 3"
                className="floating-leaf leaf3"
                ref={el => leavesRef.current[2] = el}
            />
        </div>
    );
};

export default AnimatedBackground; 