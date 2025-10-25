import React, { useState, useEffect, useRef } from 'react';
import './Typewriter.css';

const Typewriter = ({ text, speed = 25 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        animationRef.current = requestAnimationFrame(() => {
          setTimeout(typeNextChar, speed);
        });
      } else {
        setIsTypingComplete(true);
      }
    };

    // Start typing animation
    typeNextChar();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, speed]);

  return (
    <h1 className="typewriter-text">
      {displayedText}
      {!isTypingComplete && <span className="blinking-cursor">|</span>}
      {isTypingComplete && <span className="static-cursor">|</span>}
    </h1>
  );
};

export default Typewriter;
