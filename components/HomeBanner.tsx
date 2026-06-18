import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: '/slide-youtube.png',
    url: 'http://www.youtube.com/@adixo_ff',
    alt: 'Subscribe to ADIXO TV',
  },
  {
    image: '/slide-telegram.png',
    url: 'https://t.me/adixoglory',
    alt: 'Join Official ADIXO Store Telegram Channel',
  },
];

const HomeBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((prev) => (prev + 1) % slides.length, 'left');
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (nextFn: (prev: number) => number, dir: 'left' | 'right') => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(nextFn);
      setAnimating(false);
    }, 400);
  };

  const handleDotClick = (idx: number) => {
    if (idx === current) return;
    goTo(() => idx, idx > current ? 'left' : 'right');
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl" style={{ aspectRatio: '16/5' }}>
      {slides.map((slide, idx) => (
        <a
          key={idx}
          href={slide.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 block"
          style={{
            opacity: idx === current ? (animating ? 0 : 1) : 0,
            transform: idx === current
              ? `translateX(${animating ? (direction === 'left' ? '-30px' : '30px') : '0px'})`
              : `translateX(${direction === 'left' ? '30px' : '-30px'})`,
            transition: animating ? 'none' : 'opacity 0.5s ease, transform 0.5s ease',
            pointerEvents: idx === current ? 'auto' : 'none',
          }}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </a>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? 'w-5 h-2 bg-orange-500'
                : 'w-2 h-2 bg-zinc-600 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;
