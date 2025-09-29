import React, { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../assets/css/home/dining-carousel.css';

export default function DiningCarousel({ restaurants = [] }) {
  const [swiper, setSwiper] = useState(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  // Compute progress based on actual slide position (works with loop mode)
  const computeProgress = useCallback((s) => {
    // Get the original number of slides (without loop duplicates)
    const originalSlides = restaurants.length;
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
  }, [restaurants.length]);

  const handleSlide = (s) => {
    const progress = computeProgress(s);
    setActiveIndex(progress.currentIndex);
    setPage(progress.progressRatio);
    setPages(1); // We'll use ratio instead of discrete pages
  };

  useEffect(() => {
    if (!swiper) return;

    const onResize = () => {
      const progress = computeProgress(swiper);
      setPage(progress.progressRatio);
      setPages(1);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [swiper, computeProgress]);

  const Icon = ({ d, className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d}
    </svg>
  );

  return (
    <section className="dining-carousel-section">
      <div className="container">
        <h2 className="dining-title">Savor a world of flavors</h2>

        {/* Carousel */}
        <div className="dining-carousel-wrapper">
          <div className="dining-wrap">
            <Swiper
              modules={[Navigation, Pagination, Keyboard, A11y]}
              observer
              observeParents
              resizeObserver
              slidesPerView={3}
              spaceBetween={24}
              keyboard={{ enabled: true }}
              navigation={{ prevEl: '.dining-prev', nextEl: '.dining-next' }}
              breakpoints={{
                0: { slidesPerView: 1.2, spaceBetween: 16 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1200: { slidesPerView: 3, spaceBetween: 24 },
              }}
              onSwiper={setSwiper}
              onSlideChange={handleSlide}
              centeredSlides={false}
              slidesOffsetBefore={0}
              slidesOffsetAfter={0}
              initialSlide={0}
              loop={true}
            >
              {restaurants.map(restaurant => (
                <SwiperSlide key={restaurant.id} className="dining-slide">
                  <div className="dining-card">
                    <div className="dining-image">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        loading="lazy"
                      />
                      {restaurant.badge && (
                        <div className="dining-badge">
                          {restaurant.badge}
                        </div>
                      )}
                    </div>

                    <div className="dining-content">
                      <h3 className="dining-name">{restaurant.name}</h3>
                      <p className="dining-description">{restaurant.description}</p>

                      <div className="dining-details">
                        <div className="dining-detail">
                          <Icon
                            d={<path d="M3 2h18l-1 7H4L3 2zM3 9h18l-1 7H4L3 9zM8 2v5M16 2v5M8 9v5M16 9v5" />}
                            className="dining-icon"
                          />
                          <span>{restaurant.cuisine} cuisine</span>
                        </div>

                        <div className="dining-detail">
                          <Icon
                            d={<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />}
                            className="dining-icon"
                          />
                          <span>{restaurant.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Navigation buttons positioned relative to gallery */}
          <div className="dining-nav-group">
            <button className="dining-arrow dining-prev" aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="dining-arrow dining-next" aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{transform:'scaleX(-1)'}}>
                <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div
            className="dining-progress"
            style={{ "--dining-pages": pages, "--dining-page": page }}
          />
        </div>
      </div>
    </section>
  );
}
