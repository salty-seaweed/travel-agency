import { useState, useEffect, useMemo } from 'react';

export const useImageSlider = (images: string[], interval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const preloadedImages = useMemo(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    return images;
  }, [images]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % preloadedImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [preloadedImages, interval]);

  return {
    currentImage: preloadedImages[currentIndex],
    currentIndex,
  };
};
