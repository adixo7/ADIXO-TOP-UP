import React, { useState } from 'react';

interface Props {
  message: string;
}

const AnnouncementBanner: React.FC<Props> = ({ message }) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 shadow-lg">
      <div className="flex items-center gap-2 min-w-0">
        <i className="fas fa-bullhorn text-white text-sm flex-shrink-0"></i>
        <p className="text-white font-bold text-xs md:text-sm truncate">{message}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
      >
        <i className="fas fa-times text-sm"></i>
      </button>
    </div>
  );
};

export default AnnouncementBanner;
