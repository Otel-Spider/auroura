import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../assets/css/home/vertical-spotlight-slider.css';

const VerticalSpotlightSlider = ({
  eyebrow = "DISCOVER",
  heading = "The ALL Inclusive Collection. All in. All for you.",
  slides = [],
  startIndex = 0
}) => {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMouseOverTextStack, setIsMouseOverTextStack] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right'); // 'left' or 'right'
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [fadeDirection, setFadeDirection] = useState('right');
  const textColumnRef = useRef(null);
  const componentRef = useRef(null);
  const wheelThrottleRef = useRef(null);

  // Progress calculation
  const computeProgress = useCallback((currentIndex) => {
    const totalSlides = slides.length;
    const maxIndex = Math.max(0, totalSlides - 1);
    const progressRatio = maxIndex > 0 ? currentIndex / maxIndex : 0;
    return {
      currentIndex,
      progressRatio,
      totalSlides,
      maxIndex
    };
  }, [slides.length]);

  // Navigation functions
  const goToSlide = useCallback((newIndex, direction = 'right') => {
    if (newIndex === activeIndex || isAnimating || newIndex < 0 || newIndex >= slides.length) {
      return;
    }

    setIsAnimating(true);
    setSlideDirection(direction);
    setFadeDirection(direction);
    setActiveIndex(newIndex);

    // Update progress
    const progress = computeProgress(newIndex);
    setPage(progress.progressRatio);
    setPages(1);

    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }, [activeIndex, isAnimating, slides.length, computeProgress]);

  const goToPrevious = useCallback(() => {
    if (activeIndex > 0) {
      goToSlide(activeIndex - 1, 'left');
    }
  }, [activeIndex, goToSlide]);

  const goToNext = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      goToSlide(activeIndex + 1, 'right');
    }
  }, [activeIndex, slides.length, goToSlide]);

  // Wheel handler for text column
  const handleWheel = useCallback((event) => {
    // Only handle wheel events when mouse is over text stack
    if (!isMouseOverTextStack) return;

    // Prevent default page scrolling
    event.preventDefault();
    event.stopPropagation();

    // Simple throttling - only allow one wheel event per 200ms
    if (wheelThrottleRef.current) return;

    // Clear any existing timeout
    if (wheelThrottleRef.current) {
      clearTimeout(wheelThrottleRef.current);
    }

    // Set new timeout
    wheelThrottleRef.current = setTimeout(() => {
      if (event.deltaY > 10) {
        // Scroll down - next slide (with minimum threshold)
        goToNext();
      } else if (event.deltaY < -10) {
        // Scroll up - previous slide (with minimum threshold)
        goToPrevious();
      }
      wheelThrottleRef.current = null;
    }, 200); // Increased delay for better reliability
  }, [goToNext, goToPrevious, isMouseOverTextStack]);



  // Event listeners
  useEffect(() => {
    const textColumn = textColumnRef.current;

    if (textColumn) {
      // Add wheel event listener with capture to ensure it's handled first
      textColumn.addEventListener('wheel', handleWheel, {
        passive: false,
        capture: true
      });
    }

    return () => {
      if (textColumn) {
        textColumn.removeEventListener('wheel', handleWheel, { capture: true });
      }
      if (wheelThrottleRef.current) {
        clearTimeout(wheelThrottleRef.current);
        wheelThrottleRef.current = null;
      }
    };
  }, [handleWheel]);

  // Initialize progress
  useEffect(() => {
    const progress = computeProgress(activeIndex);
    setPage(progress.progressRatio);
    setPages(1);
  }, [activeIndex, computeProgress]);

  // Preload adjacent images for faster transitions
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
      // Set additional attributes for faster loading
      img.crossOrigin = 'anonymous';
      img.loading = 'eager';
    };

    // Preload next image
    if (activeIndex < slides.length - 1) {
      preloadImage(slides[activeIndex + 1].image);
    }

    // Preload previous image
    if (activeIndex > 0) {
      preloadImage(slides[activeIndex - 1].image);
    }

    // Preload images 2 steps ahead for even faster navigation
    if (activeIndex < slides.length - 2) {
      preloadImage(slides[activeIndex + 2].image);
    }
    if (activeIndex > 1) {
      preloadImage(slides[activeIndex - 2].image);
    }
  }, [activeIndex, slides]);

  // Preload all images on component mount for maximum speed
  useEffect(() => {
    const preloadAllImages = () => {
      slides.forEach((slide, index) => {
        if (index !== activeIndex) { // Don't preload current image again
          const img = new Image();
          img.src = slide.image;
          img.crossOrigin = 'anonymous';
          img.loading = 'eager';
        }
      });
    };

    // Preload all images immediately for maximum speed
    preloadAllImages();

    return () => {};
  }, [slides, activeIndex]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex];

  // Add resource hints for faster loading - preload all images
  const preloadLinks = slides.map((slide, index) => (
    <link
      key={`preload-${index}`}
      rel="preload"
      as="image"
      href={slide.image}
    />
  ));

  return (
    <section className="vertical-spotlight-slider" ref={componentRef}>
      {/* Preload critical images */}
      {preloadLinks}
      <div className="vss-background">
        <div className="container-xxl">
          <div className="vss-header">
            <div className="vss-eyebrow">{eyebrow}</div>
            <h2 className="vss-heading">{heading}</h2>
          </div>

          <div className="vss-content">
            {/* Desktop Layout */}
            <div className="row g-4 align-items-center d-none d-lg-flex">
              {/* Left Controls */}
              <div className="col-auto">
                <div className="vss-controls">
                  <button
                    className="vss-control vss-control-up"
                    onClick={goToPrevious}
                    aria-label="Previous slide"
                    disabled={isAnimating}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="vss-control vss-control-down"
                    onClick={goToNext}
                    aria-label="Next slide"
                    disabled={isAnimating}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Center Image */}
              <div className="col-12 col-lg-6">
                <div className="vss-image-container">
                  <div
                    className={`vss-image ${
                      isAnimating
                        ? fadeDirection === 'right'
                          ? 'vss-image-fade-right'
                          : 'vss-image-fade-left'
                        : 'vss-image-current'
                    }`}
                    aria-live="polite"
                  >
                    <img
                      src={activeSlide.image}
                      alt={activeSlide.title}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Right Text Stack */}
              <div className="col-12 col-lg-5">
                <div
                  className="vss-text-stack"
                  ref={textColumnRef}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setIsMouseOverTextStack(true);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    setIsMouseOverTextStack(false);
                  }}
                >
                  {slides.map((slide, index) => {
                    const isActive = index === activeIndex;
                    const offsetDistance = 150;
                    const offset = index - activeIndex;

                    return (
                      <div
                        key={slide.id}
                        className={`vss-text-item ${
                          isActive ? 'vss-text-active' : 'vss-text-inactive'
                        }`}
                        style={{
                          transform: isActive
                            ? 'translateY(-50%) scale(1)'
                            : `translateY(calc(-50% + ${offset * offsetDistance}px)) scale(0.85)`,
                          zIndex: isActive ? 10 : Math.max(1, 10 - Math.abs(offset))
                        }}
                        aria-current={isActive ? 'true' : 'false'}
                      >
                        <h3 className="vss-text-title">{slide.title}</h3>
                        {slide.description && isActive && (
                          <p className="vss-text-description">{slide.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="vss-mobile-layout d-lg-none">
              {/* Image */}
              <div className="vss-mobile-image">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Text Loop */}
              <div className="vss-mobile-text-loop">
                {slides.map((slide, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <div
                      key={slide.id}
                      className={`vss-mobile-text-item ${
                        isActive ? 'vss-mobile-text-active' : 'vss-mobile-text-inactive'
                      }`}
                      aria-current={isActive ? 'true' : 'false'}
                    >
                      <h3 className="vss-mobile-title">{slide.title}</h3>
                      {slide.description && (
                        <p className="vss-mobile-description">{slide.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="vss-progress" style={{ "--vss-pages": pages, "--vss-page": page }}></div>

              {/* Navigation Buttons */}
              <div className="vss-mobile-controls">
                <button
                  className="vss-mobile-control vss-mobile-prev"
                  onClick={goToPrevious}
                  aria-label="Previous slide"
                  disabled={isAnimating}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className="vss-mobile-control vss-mobile-next"
                  onClick={goToNext}
                  aria-label="Next slide"
                  disabled={isAnimating}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerticalSpotlightSlider;
