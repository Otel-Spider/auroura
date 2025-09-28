import React, { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import Lightbox from './Lightbox';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../assets/css/home/resort-intro-gallery.css';
import axios from 'axios';

const ResortIntroGallery = ({
  // Props for backward compatibility (will be overridden by API data)
  title: propTitle = "Welcome to Rixos Sharm El Sheikh Adults Only 18+",
  description: propDescription = "Experience luxury and relaxation at our exclusive adults-only resort. Nestled along the pristine shores of the Red Sea, Rixos Sharm El Sheikh offers an unparalleled escape with world-class amenities, gourmet dining, and breathtaking views. Our all-inclusive experience ensures every moment is crafted to perfection, from sunrise yoga sessions to sunset cocktails by the infinity pool.",
  checkIn: propCheckIn = "Check-in – 2:00 PM",
  checkOut: propCheckOut = "Check-out – 12:00 PM",
  images: propImages = [
    { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=450&fit=crop", alt: "Resort exterior view" },
    { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop", alt: "Luxury pool area" },
    { src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop", alt: "Beachfront view" },
    { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=450&fit=crop", alt: "Spa and wellness center" },
    { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=450&fit=crop", alt: "Gourmet restaurant" },
    { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop", alt: "Sunset terrace" },
    { src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop", alt: "Luxury suite interior" },
    { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=450&fit=crop", alt: "Infinity pool at night" }
  ],
  initialIndex = 0,
  onOpenGallery
}) => {
  // State for API data
  const [galleryData, setGalleryData] = useState(null);
  const [swiper, setSwiper] = useState(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(initialIndex);

  // Load gallery data from API
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await axios.get('/api/gallery/active');
        setGalleryData(response.data);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        // Use default props on error
      }
    };

    fetchGalleryData();
  }, []);

  // Use API data or fallback to props
  const title = galleryData?.title || propTitle;
  const description = galleryData?.description || propDescription;
  const checkIn = galleryData?.check_in || propCheckIn;
  const checkOut = galleryData?.check_out || propCheckOut;
  const images = (galleryData?.images && galleryData.images.length > 0) ? galleryData.images : propImages;

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
    setActiveIndex(progress.currentIndex);
    setPage(progress.progressRatio);
    setPages(1); // We'll use ratio instead of discrete pages
    setLightboxIndex(progress.currentIndex);
  };

  useEffect(() => {
    if (!swiper) return;

    // Ensure navigation is properly initialized
    if (swiper.navigation) {
      swiper.navigation.init();
      swiper.navigation.update();
    }

    const onResize = () => {
      const progress = computeProgress(swiper);
      setPage(progress.progressRatio);
      setPages(1);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [swiper, computeProgress]);

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

  return (
    <section className="resort-intro-gallery">
      <div className="container">
        <div className="row g-4">
          {/* Left column */}
          <div className="col-lg-6 rig-col-text">
            <div className="rig-text-content">
              <h1 className="rig-title">{title}</h1>

              <div className="rig-description">
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </div>

              <div className="rig-check-info">
                <div className="rig-check-item">
                  <svg className="rig-calendar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="currentColor"/>
                    <path d="M7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10ZM7 14H9V16H7V14ZM11 14H13V16H11V14ZM15 14H17V16H15V14Z" fill="currentColor"/>
                  </svg>
                  <span>{checkIn}</span>
                </div>

                <div className="rig-check-item">
                  <svg className="rig-calendar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="currentColor"/>
                    <path d="M7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10ZM7 14H9V16H7V14ZM11 14H13V16H11V14ZM15 14H17V16H15V14Z" fill="currentColor"/>
                  </svg>
                  <span>{checkOut}</span>
                </div>
              </div>

              <div className="rig-divider"></div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-lg-6">
            <div className="rig-gallery position-relative">
              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y]}
                observer
                observeParents
                resizeObserver
                slidesPerView={1.5}
                spaceBetween={16}
                keyboard={{ enabled: true }}
                navigation={{ prevEl: '.rig-prev', nextEl: '.rig-next' }}
                breakpoints={{
                  0:   { slidesPerView: 1.3, spaceBetween: 12 },
                  768: { slidesPerView: 1.4, spaceBetween: 14 },
                  992: { slidesPerView: 1.5, spaceBetween: 16 },
                }}
                onSwiper={setSwiper}
                onSlideChange={handleSlide}
                centeredSlides={false}
                slidesOffsetBefore={0}
                slidesOffsetAfter={0}
                initialSlide={0}
                loop={true}
                loopAdditionalSlides={2}
                loopedSlides={2}
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i} className="rig-slide">
                    <button
                      className="rig-card"
                      onClick={() => handleOpenLightbox(i)}
                      aria-label={`Open image ${i+1}`}
                    >
                      <img
                        className="rig-img"
                        src={img.src}
                        alt={img.alt || ''}
                        loading="lazy"
                        onError={(e)=>{ e.currentTarget.src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>'; e.currentTarget.classList.add('is-fallback'); }}
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Progress bar inside gallery */}
              <div className="rig-progress-wrap">
                <div
                  className="rig-progress"
                  style={{
                    '--rig-pages': pages,
                    '--rig-page': page
                  }}
                />
                <button
                  className="rig-view"
                  onClick={() => handleOpenLightbox(activeIndex)}
                >
                  VIEW GALLERY →
                </button>
              </div>

              {/* Navigation buttons positioned relative to gallery */}
              <div className="rig-nav-group">
                <button className="rig-arrow rig-prev" aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="rig-arrow rig-next" aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{transform:'scaleX(-1)'}}>
                    <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
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

export default ResortIntroGallery;
