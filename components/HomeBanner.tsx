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

interface Props {
  initialSlide?: number;
}

const HomeBanner: React.FC<Props> = ({ initialSlide = 0 }) => {
  const [current, setCurrent] = useState(initialSlide % slides.length);

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

    </div>
  );
};

export default HomeBanner;
