import React, { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import Lightbox from '../ResortIntroGallery/Lightbox';
import "swiper/css";
import "swiper/css/navigation";
import "../../assets/css/home/activity-showcase.css";

const ActivityShowcase = ({
  title = "What's your game plan?",
  description = "Discover endless adventures and activities designed to create unforgettable memories.\n\nFrom thrilling water sports to relaxing spa treatments, our resort offers something for every guest.\n\nWhether you're seeking adventure or tranquility, we have the perfect activities to match your mood and create lasting experiences.",
  images = [],
  onOpenGallery
}) => {
  const [swiper, setSwiper] = useState(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const computeProgress = (s) => {
    // Get the original number of slides (without loop duplicates)
    const originalSlides = images.length;
    const currentIndex = s.realIndex; // Use realIndex for loop mode
    
    // Calculate progress ratio based on original slides
    const maxIndex = Math.max(0, originalSlides - 1);
    const progressRatio = maxIndex > 0 ? currentIndex / maxIndex : 0;
    
    return {
      currentIndex,
      progressRatio,
      totalSlides: originalSlides,
      maxIndex
    };
  };

  useEffect(() => {
    if (swiper) {
      const progress = computeProgress(swiper);
      setPage(progress.progressRatio);
      setPages(1); // We'll use ratio instead of discrete pages
    }
  }, [swiper, images.length]);

  const onSlide = (s) => {
    const progress = computeProgress(s);
    setActiveIndex(progress.currentIndex);
    setPage(progress.progressRatio);
    setPages(1);
    setLightboxIndex(progress.currentIndex);
  };

  // Handle lightbox open
  const handleOpenLightbox = (index = 0) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    if (onOpenGallery) onOpenGallery(index);
  };

  // Handle lightbox close
  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Split description into paragraphs
  const paragraphs = description.split('\n').filter(p => p.trim());

  return (
    <section className="activity-showcase">
      <div className="container-fluid">
        <div className="row g-4">
          {/* Left column - Image slider */}
          <div className="col-lg-7">
            <div className="activity-slider-wrapper">
              <Swiper
                className="activity-swiper"
                modules={[Navigation, Keyboard, A11y]}
                observer
                observeParents
                resizeObserver
                navigation={{ prevEl: ".activity-prev", nextEl: ".activity-next" }}
                keyboard={{ enabled: true }}
                loop={true}
                loopAdditionalSlides={2}
                loopedSlides={2}
                slidesPerView={2}
                spaceBetween={28}
                breakpoints={{
                  0: { slidesPerView: 1.1, spaceBetween: 16 },
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1200: { slidesPerView: 2, spaceBetween: 28 },
                }}
                onSwiper={setSwiper}
                onSlideChange={onSlide}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index} className="activity-slide">
                    <button 
                      className="activity-image" 
                      onClick={() => handleOpenLightbox(index)} 
                      aria-label={`Open image ${index+1}`}
                    >
                      <img 
                        src={img.src} 
                        alt={img.alt || `Activity image ${index + 1}`} 
                        loading="lazy" 
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation arrows - desktop */}
              <div className="activity-arrows d-none d-lg-block">
                <button className="activity-arrow activity-prev" aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="activity-arrow activity-next" aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{transform: 'scaleX(-1)'}}>
                    <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Progress bar and view gallery */}
              <div className="activity-controls">
                <div
                  className="activity-progress"
                  style={{ "--as-pages": pages, "--as-page": page }}
                />
                <button 
                  className="activity-view-gallery" 
                  onClick={() => handleOpenLightbox(activeIndex)}
                >
                  VIEW GALLERY →
                </button>
              </div>

              {/* Mobile navigation - pill style */}
              <div className="activity-mobile-nav d-lg-none">
                <div className="activity-nav-pill">
                  <button 
                    className="activity-mobile-arrow activity-prev" 
                    aria-label="Previous"
                    onClick={() => swiper?.slidePrev()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    className="activity-mobile-arrow activity-next" 
                    aria-label="Next"
                    onClick={() => swiper?.slideNext()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{transform: 'scaleX(-1)'}}>
                      <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Text content */}
          <div className="col-lg-5">
            <div className="activity-content">
              <h2 className="activity-title">{title}</h2>
              
              <div className="activity-description">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lightbox */}
      {isLightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={handleCloseLightbox}
        />
      )}
    </section>
  );
};

export default ActivityShowcase;
