import React, { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Zoom, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/zoom';

const Lightbox = ({ images, initialIndex = 0, onClose }) => {
  const [swiper, setSwiper] = useState(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  // Compute progress based on actual slide position (works with loop mode)
  const computeProgress = useCallback((s) => {
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
  }, [images.length]);

  const handleSlide = (s) => {
    const progress = computeProgress(s);
    setPage(progress.progressRatio);
    setPages(1);
  };

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Initialize navigation when swiper is ready
  useEffect(() => {
    if (!swiper) return;

    // Ensure navigation is properly initialized
    if (swiper.navigation) {
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [swiper]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="rig-lightbox" role="dialog" aria-modal="true" aria-label="Image Gallery">
      <div className="rig-lightbox-backdrop" onClick={onClose}></div>

      <button className="rig-close" onClick={onClose} aria-label="Close gallery">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <Swiper
        modules={[Navigation, Keyboard, Zoom, A11y]}
        initialSlide={initialIndex}
        navigation={{ prevEl: '.rig-lightbox-prev', nextEl: '.rig-lightbox-next' }}
        keyboard={{ enabled: true }}
        zoom
        className="rig-lightbox-swiper"
        onSwiper={setSwiper}
        onSlideChange={handleSlide}
        loop={true}
        loopAdditionalSlides={2}
        slidesPerView={1}
        spaceBetween={8}
        centeredSlides={true}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 6 },
          768: { slidesPerView: 1, spaceBetween: 8 },
          1024: { slidesPerView: 1, spaceBetween: 8 }
        }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="swiper-zoom-container">
              <img src={img.src} alt={img.alt || ''} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress bar */}
      <div className="rig-lightbox-progress-wrap">
        <div
          className="rig-lightbox-progress"
          style={{
            '--rig-pages': pages,
            '--rig-page': page
          }}
        />
      </div>

      {/* Navigation buttons */}
      <div className="rig-lightbox-nav-group">
        <button className="rig-lightbox-arrow rig-lightbox-prev" aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="rig-lightbox-arrow rig-lightbox-next" aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{transform:'scaleX(-1)'}}>
            <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
