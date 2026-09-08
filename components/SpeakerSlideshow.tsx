"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SpeakerSlideshowProps {
  images: readonly string[];
  captions?: readonly string[];
}

export const SpeakerSlideshow: React.FC<SpeakerSlideshowProps> = ({ images, captions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [images.length, currentIndex]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return <div className="relative w-full h-full overflow-hidden bg-black/20" />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/40"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/40"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 w-full px-4">
        {captions && captions[currentIndex] && (
          <motion.span
            key={captions[currentIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-eyebrow font-bold tracking-[0.2em] uppercase text-white/80 bg-black/40 px-2 py-1 rounded-sm backdrop-blur-sm"
          >
            {captions[currentIndex]}
          </motion.span>
        )}
        <div className="flex gap-2 bg-black/15 px-2 py-1 rounded-full">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-white scale-125"
                  : "bg-white/60 hover:bg-white/90"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
