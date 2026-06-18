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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (idx: number) => {
    setCurrent(idx);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl mx-auto" style={{ aspectRatio: '16/9', maxWidth: '560px', width: '100%' }}>
      {slides.map((slide, idx) => (
        <a
          key={idx}
          href={slide.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 block"
          style={{
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 0.7s ease',
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
