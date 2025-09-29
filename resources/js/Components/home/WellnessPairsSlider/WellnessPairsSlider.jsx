import React, { useState, useCallback, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../assets/css/home/wellness-pairs-slider.css';

const WellnessPairsSlider = ({ 
  heading = "Reset mind, body and spirit",
  intro = "Discover our curated wellness experiences designed to restore balance and harmony to your daily routine.",
  items = []
}) => {
  const [swiper, setSwiper] = useState(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const computeProgress = useCallback((s) => {
    const originalSlides = items.length;
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
  }, [items.length]);

  const onSlide = useCallback((s) => {
    if (s) {
      const progress = computeProgress(s);
      setPage(progress.progressRatio);
      setPages(1);
    }
  }, [computeProgress]);

  // Initialize progress
  useEffect(() => {
    if (swiper) {
      const progress = computeProgress(swiper);
      setPage(progress.progressRatio);
      setPages(1); // We'll use ratio instead of discrete pages
    }
  }, [swiper, items.length, computeProgress]);

  return (
    <section className="wellness-pairs-slider">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="wps-header text-center mb-5">
              <h2 className="wps-heading">{heading}</h2>
              {intro && <p className="wps-intro">{intro}</p>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="wps-carousel-wrapper">
              <div className="wps-swiper-wrapper">
                <Swiper
                modules={[Navigation, Keyboard, A11y]}
                navigation={{ prevEl: ".wps-prev", nextEl: ".wps-next" }}
                keyboard={{ enabled: true }}
                a11y={{ enabled: true }}
                loop={true}
                slidesPerView={2}
                slidesPerGroup={1}
                spaceBetween={24}
                breakpoints={{
                  0: { 
                    slidesPerView: 1,
                    spaceBetween: 16
                  },
                  576: { 
                    slidesPerView: 1.2,
                    spaceBetween: 20
                  },
                  992: { 
                    slidesPerView: 2,
                    spaceBetween: 24
                  }
                }}
                onSwiper={setSwiper}
                onSlideChange={onSlide}
                className="wps-swiper"
              >
                {items.map((item, itemIndex) => (
                  <SwiperSlide key={item.id} className="wps-slide">
                    <div className="wps-item">
                      <div className="row g-3">
                        <div className="col-8">
                          <div className="wps-image-wrapper">
                            <img
                              src={item.image.src}
                              alt={item.image.alt || item.title}
                              className="wps-image"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="wps-content">
                            <h3 className="wps-title">{item.title}</h3>
                            <p className="wps-text">{item.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              </div>

              {/* Navigation buttons - desktop */}
              <div className="wps-nav-group d-none d-lg-block">
                <button className="wps-arrow wps-prev" aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="wps-arrow wps-next" aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{transform: 'scaleX(-1)'}}>
                    <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Progress bar */}
              <div
                className="wps-progress"
                style={{ "--wps-pages": pages, "--wps-page": page }}
              />

              {/* Mobile navigation pill */}
              <div className="wps-nav-group d-lg-none">
                <button className="wps-arrow wps-prev" aria-label="Previous">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="wps-arrow wps-next" aria-label="Next">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{transform: 'scaleX(-1)'}}>
                    <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

export default WellnessPairsSlider;
