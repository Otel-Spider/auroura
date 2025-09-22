import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../../assets/css/home/rooms.css";

export default function RoomsSection({ items }) {
  const data = items;

  const [swiper, setSwiper] = useState(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const computeProgress = (s) => {
    // Get the original number of slides (without loop duplicates)
    const originalSlides = data.length;
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
  }, [swiper, data.length]);

  const onSlide = (s) => {
    const progress = computeProgress(s);
    setPage(progress.progressRatio);
    setPages(1);
  };

  const Icon = ({ d }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );

  return (
    <section className="rooms-section">
      <Container fluid className="px-3 px-md-4 px-lg-5">
        <Row>
          <Col xs={8}>
            <h2 className="mb-4 text-center rooms-title mb-md-5">Our beautiful, restful rooms</h2>
          </Col>
        </Row>

        {/* Carousel */}
        <Row>
          <Col xs={12}>
            <div className="rooms-carousel-wrapper">
              <div className="rooms-wrap">
                <Swiper
                  className="rooms-swiper"
                  modules={[Navigation, Keyboard, A11y]}
                  observer
                  observeParents
                  resizeObserver
                  navigation={{ prevEl: ".rooms-prev", nextEl: ".rooms-next" }}
                  keyboard={{ enabled: true }}
                  loop={true}
                  loopAdditionalSlides={2}
                  loopedSlides={2}
                  slidesPerView={4}
                  spaceBetween={12}
                  breakpoints={{
                    0: { slidesPerView: 1.2, spaceBetween: 8 },
                    576: { slidesPerView: 1.5, spaceBetween: 10 },
                    768: { slidesPerView: 2.2, spaceBetween: 12 },
                    992: { slidesPerView: 3, spaceBetween: 12 },
                    1200: { slidesPerView: 4, spaceBetween: 12 },
                  }}
                  onSwiper={setSwiper}
                  onSlideChange={onSlide}
                >
                  {data.map(room => (
                    <SwiperSlide key={room.id} className="rooms-slide">
                      <div className="rooms-cover">
                        <img src={room.image} alt={room.title} loading="lazy" className="img-fluid" />
                      </div>
                      <div className="p-3 rooms-body p-md-4">
                        <div className="mb-3 rooms-name">{room.title}</div>

                        <div className="mb-3 rooms-features-grid row g-2">
                          <div className="rooms-feat col-6 col-lg-3">
                            <Icon d={<path d="M4 20h16M6 20V8h12v12M9 8V4h6v4" />} />
                            <span>{room.area}</span>
                          </div>
                          <div className="rooms-feat col-6 col-lg-3">
                            <Icon d={<path d="M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-6 8a6 6 0 0 1 12 0" />} />
                            <span>{room.occupancy}</span>
                          </div>
                          <div className="rooms-feat col-6 col-lg-3">
                            <Icon d={<path d="M3 12h18M6 8h12M6 16h12" />} />
                            <span>{room.bed}</span>
                          </div>
                          <div className="rooms-feat col-6 col-lg-3">
                            <Icon d={<path d="M3 18l7-7 4 4 7-7" />} />
                            <span>{room.view}</span>
                          </div>
                        </div>

                        <div className="gap-2 rooms-buttons d-flex flex-column flex-md-row">
                          <button className="rooms-more btn btn-outline-primary flex-fill">
                            SEE ROOM DETAILS
                            <svg className="arr ms-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                          </button>
                          <a className="rooms-cta btn btn-primary flex-fill" href={room.ctaUrl || "#"}>BOOK NOW</a>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Navigation buttons */}
                <div className="rooms-nav-group d-none d-md-flex">
                  <button className="rooms-arrow rooms-prev" aria-label="Previous">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="rooms-arrow rooms-next" aria-label="Next">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{transform: 'scaleX(-1)'}}>
                      <path d="M10.5 3.5 6 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* progress under carousel */}
              <div
                className="rooms-progress"
                style={{ "--rooms-pages": pages, "--rooms-page": page }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
