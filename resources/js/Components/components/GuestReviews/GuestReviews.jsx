import React, { useState, useMemo } from 'react';
import '../../assets/css/home/guest-reviews.css';

// Star Rating Component
const RatingStars = ({ rating, size = 20, className = "" }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    let fillPercentage = 0;
    
    if (i < fullStars) {
      fillPercentage = 100;
    } else if (i === fullStars && hasHalfStar) {
      fillPercentage = 50;
    }

    stars.push(
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`star ${className}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`star-gradient-${i}`}>
            <stop offset="0%" stopColor="var(--gr-accent)" />
            <stop offset={`${fillPercentage}%`} stopColor="var(--gr-accent)" />
            <stop offset={`${fillPercentage}%`} stopColor="#ddd" />
            <stop offset="100%" stopColor="#ddd" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={`url(#star-gradient-${i})`}
        />
      </svg>
    );
  }

  return (
    <div 
      className="rating-stars" 
      aria-label={`Rating: ${rating} out of 5`}
      role="img"
    >
      {stars}
    </div>
  );
};

// Individual Review Component
const ReviewItem = ({ review, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDate = (dateISO) => {
    const date = new Date(dateISO);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} . ${month} . ${year}`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-meta">
          <div className="review-name">{review.name}</div>
          {review.segment && (
            <div className="review-segment">{review.segment}</div>
          )}
          <div className="review-date">{formatDate(review.dateISO)}</div>
        </div>
      </div>
      
      <div className="review-rating">
        <RatingStars rating={review.rating} size={16} />
      </div>
      
      <div className="review-body">
        <p 
          className={`review-text ${isExpanded ? 'expanded' : 'collapsed'}`}
          style={{ color: theme.text }}
        >
          {review.body}
        </p>
        {review.body.length > 150 && (
          <button
            className="review-toggle"
            onClick={toggleExpanded}
            aria-expanded={isExpanded}
            aria-controls={`review-${review.id}`}
            style={{ color: theme.accent }}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
};

// Main GuestReviews Component
const GuestReviews = ({
  heading = "What our guests say",
  subtitle = "100% genuine reviews from our guests",
  learnMoreHref = "#",
  aggregate = { score: 4.8, outOf: 5, count: 897 },
  reviews = [],
  pageSize = 3,
  theme = {}
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Merge theme with defaults
  const mergedTheme = useMemo(() => ({
    accent: '#a89052',
    heading: '#0f1d35',
    text: '#111321',
    muted: '#6f7380',
    cardBg: '#f7f2e6',
    ...theme
  }), [theme]);

  // Calculate pagination - show accumulated reviews
  const totalPages = Math.ceil(reviews.length / pageSize);
  const endIndex = currentPage * pageSize;
  const currentReviews = reviews.slice(0, endIndex);
  const hasMore = endIndex < reviews.length;

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <section className="guest-reviews-section">
      <div className="container-xxl">
        <div className="row g-5">
          {/* Left Column - Heading */}
          <div className="col-12 col-lg-5">
            <div className="reviews-intro">
              <h2 
                className="reviews-heading"
                style={{ color: mergedTheme.heading }}
              >
                {heading}
              </h2>
              
              <p 
                className="reviews-subtitle"
                style={{ color: mergedTheme.muted }}
              >
                {subtitle}
              </p>
              
              <a 
                href={learnMoreHref}
                className="reviews-learn-more"
                style={{ color: mergedTheme.accent }}
              >
                LEARN HOW OUR REVIEWS WORK
              </a>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="col-12 col-lg-7">
            <div className="reviews-content">
              {/* Aggregate Rating Box */}
              <div 
                className="aggregate-rating"
                style={{ backgroundColor: mergedTheme.cardBg }}
              >
                <div className="aggregate-score">
                  <span 
                    className="score-number"
                    style={{ color: mergedTheme.heading }}
                  >
                    {aggregate.score}
                  </span>
                  <span 
                    className="score-out-of"
                    style={{ color: mergedTheme.muted }}
                  >
                    /{aggregate.outOf}
                  </span>
                </div>
                
                <div className="aggregate-details">
                  <div className="stars-and-count">
                    <RatingStars rating={aggregate.score} size={20} />
                    <span 
                      className="review-count"
                      style={{ color: mergedTheme.muted }}
                    >
                      {aggregate.count} reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="reviews-list">
                {currentReviews.map((review, index) => (
                  <React.Fragment key={review.id}>
                    <ReviewItem review={review} theme={mergedTheme} />
                    {index < currentReviews.length - 1 && (
                      <div className="review-divider" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="load-more-container">
                  <button
                    className="load-more-btn"
                    onClick={loadMore}
                    style={{ 
                      color: mergedTheme.accent,
                      borderColor: mergedTheme.accent
                    }}
                  >
                    Load more reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuestReviews;
