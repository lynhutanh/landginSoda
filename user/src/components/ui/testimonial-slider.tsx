"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";

// Define the type for a single review
type Review = {
  id: string | number;
  name: string;
  affiliation: string;
  quote: string;
  imageSrc: string;
  thumbnailSrc: string;
};

// Define the props for the slider component
interface TestimonialSliderProps {
  reviews: Review[];
  /** Optional class name for the container */
  className?: string;
}

export const TestimonialSlider = ({
  reviews,
  className,
}: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const activeReview = reviews[currentIndex];

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  const thumbnailReviews = reviews
    .filter((_, i) => i !== currentIndex)
    .slice(0, 3);

  const imageVariants = {
    enter: (direction: "left" | "right") => ({
      y: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      y: direction === "right" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const textVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 50 : -50,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full min-h-[650px] md:min-h-[500px] overflow-hidden bg-transparent text-white p-8 md:p-12",
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
        {/* === Left Column: Meta and Thumbnails === */}
        <div className="md:col-span-3 flex flex-col justify-between order-2 md:order-1">
          <div className="flex flex-row md:flex-col justify-between md:justify-start space-x-4 md:space-x-0 md:space-y-4">
            {/* Pagination */}
            <span className="text-sm text-white/40 font-mono">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(reviews.length).padStart(2, "0")}
            </span>
            {/* Vertical Text */}
            <h2 className="text-xs font-semibold tracking-widest uppercase [writing-mode:vertical-rl] md:rotate-180 hidden md:block text-white/30">
              FOUNDERS
            </h2>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex space-x-2 mt-8 md:mt-0">
            {thumbnailReviews.map((review) => {
              const originalIndex = reviews.findIndex(
                (r) => r.id === review.id
              );
              return (
                <button
                  key={review.id}
                  onClick={() => handleThumbnailClick(originalIndex)}
                  className="overflow-hidden rounded-lg w-16 h-20 md:w-20 md:h-24 opacity-50 hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:ring-offset-transparent border border-white/10"
                  aria-label={`View testimonial from ${review.name}`}
                >
                  <img
                    src={review.thumbnailSrc}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* === Center Column: Main Image === */}
        <div className="md:col-span-4 relative h-80 min-h-[350px] md:min-h-[450px] order-1 md:order-2">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={activeReview.imageSrc}
              alt={activeReview.name}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 w-full h-full object-cover rounded-2xl border border-white/10"
            />
          </AnimatePresence>
        </div>

        {/* === Right Column: Text and Navigation === */}
        <div className="md:col-span-5 flex flex-col justify-between md:pl-8 order-3 md:order-3">
          {/* Text Content */}
          <div className="relative overflow-hidden pt-4 md:pt-16 min-h-[220px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <p className="text-xs font-bold tracking-wider text-pink-300 uppercase">
                  {activeReview.affiliation}
                </p>
                <h3 className="text-2xl font-bold mt-1 text-white">
                  {activeReview.name}
                </h3>
                <blockquote className="mt-6 text-xl md:text-2xl font-medium leading-relaxed text-white/90 italic">
                  "{activeReview.quote}"
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4 mt-8 md:mt-0">
            <Button
              variant="outline"
              size="md"
              className="rounded-full w-12 h-12 border-white/20 text-white hover:bg-white/10 hover:text-white"
              onClick={handlePrev}
              aria-label="Previous founder"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="primary"
              size="md"
              className="rounded-full w-12 h-12 bg-pink-300 text-black hover:bg-pink-200"
              onClick={handleNext}
              aria-label="Next founder"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
