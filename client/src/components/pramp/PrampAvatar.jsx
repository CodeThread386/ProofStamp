import { useState, useEffect } from 'react';

export default function PrampAvatar({ position, isCelebrating, isThinking, onClick, isFlipped, avatarMessage }) {
  const [bounce, setBounce] = useState(false);

  // Random idle bouncing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBounce(true);
        setTimeout(() => setBounce(false), 500);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={onClick}
      className={`fixed z-[100] cursor-pointer drop-shadow-2xl transition-all duration-[1000ms] ease-in-out
        ${bounce || isCelebrating ? '-translate-y-4' : 'translate-y-0'}
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <div className={`relative ${isThinking ? 'animate-pulse' : ''}`}>
        {/* Avatar Message Bubble */}
        {avatarMessage && !isThinking && (
          <div className="absolute -top-8 -left-8 bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-bounce">
            {avatarMessage}
            {/* Tail of the speech bubble */}
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-indigo-500 rotate-45"></div>
          </div>
        )}

        {/* Simple Cute Dog SVG */}
        <div style={{ transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)', transition: 'transform 0.5s ease' }}>
          <svg className={`${isCelebrating ? 'animate-spin' : ''}`} width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ears */}
            <path d="M20 40 Q 10 10 30 20 Z" fill="#E2B77E" />
            <path d="M80 40 Q 90 10 70 20 Z" fill="#E2B77E" />
            
            {/* Head */}
            <circle cx="50" cy="50" r="35" fill="#F4D09C" />
            
            {/* Eyes */}
            <circle cx="35" cy="45" r="5" fill="#2D3748" />
            <circle cx="65" cy="45" r="5" fill="#2D3748" />
            
            {/* Eye sparkles */}
            <circle cx="33" cy="43" r="2" fill="white" />
            <circle cx="63" cy="43" r="2" fill="white" />
            
            {/* Nose */}
            <ellipse cx="50" cy="55" rx="8" ry="5" fill="#2D3748" />
            
            {/* Muzzle / Smile */}
            <path d="M42 65 Q 50 75 58 65" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" fill="transparent" />
            
            {/* Tongue (visible when celebrating) */}
            {isCelebrating && (
              <path d="M47 68 Q 50 80 53 68 Z" fill="#FF7B9C" />
            )}
          </svg>
        </div>

        {isThinking && (
          <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 text-xs px-3 py-1 rounded-full text-white animate-bounce shadow-lg">
            thinking...
          </div>
        )}
      </div>
    </div>
  );
}
