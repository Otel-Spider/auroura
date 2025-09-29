import React, { useState, useEffect } from 'react';
import '../../assets/css/home/offers-deck.css';

const OffersDeck = ({ 
  eyebrow = "HOTEL OFFERS",
  heading = "Special offers",
  intro = "Discover exclusive packages and limited-time deals designed to enhance your stay with us.",
  items = []
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => prev === 0 ? items.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => prev === items.length - 1 ? 0 : prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length]);

  const handleCardClick = (index) => {
    // Just make the card active, no navigation
    setActiveIndex(index);
  };

  const getCardStyle = (index) => {
    const isActive = index === activeIndex;
    const totalCards = items.length;
    const maxVisible = Math.min(totalCards, 5); // Show up to 5 cards for better visibility
    
    if (isActive) {
      return {
        transform: 'translateY(0) scale(1) rotate(0deg)',
        zIndex: totalCards + 1,
        opacity: 1
      };
    }

    // Calculate position for half-circle arrangement with more rotation
    const stackIndex = Math.min(index, maxVisible - 1);
    const centerIndex = Math.floor(maxVisible / 2);
    const angleStep = 30; // Much more degrees between each card
    const radius = 100; // Larger distance from center
    
    // Calculate angle for this card (centered around 0)
    const angle = (stackIndex - centerIndex) * angleStep;
    const angleRad = (angle * Math.PI) / 180;
    
    // Calculate position using trigonometry
    const translateX = Math.sin(angleRad) * radius;
    const translateY = Math.cos(angleRad) * radius * 0.1; // Very flattened circle
    const rotation = angle * 0.8; // Much more rotation for better accessibility
    
    const scale = 1 - (stackIndex * 0.005); // Very minimal scale difference
    const zIndex = totalCards - index;

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
      zIndex,
      opacity: index < maxVisible ? 1 : 0.7 // High opacity for better visibility
    };
  };

  return (
    <section className="offers-deck">
      <div className="container-xxl">
        <div className="row g-4 align-items-center">
          {/* Left Column - Text Content */}
          <div className="col-12 col-lg-4">
            <div className="od-content">
              <div className="od-eyebrow">{eyebrow}</div>
              <h2 className="od-heading">{heading}</h2>
              <p className="od-intro">{intro}</p>
            </div>
          </div>

          {/* Right Column - Card Deck */}
          <div className="col-12 col-lg-8">
            <div className="od-deck-container">
              <div className="od-deck">
                {items.map((offer, index) => (
                  <button
                    key={offer.id}
                    className={`od-card ${index === activeIndex ? 'od-card--active' : ''}`}
                    style={getCardStyle(index)}
                    onClick={() => handleCardClick(index)}
                    aria-pressed={index === activeIndex}
                    aria-label={`View offer: ${offer.title}`}
                  >
                    <div className="od-card-image">
                      <img
                        src={offer.image}
                        alt={offer.alt || offer.title}
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Overlay - only visible on active card */}
                    {index === activeIndex && (
                      <div className="od-overlay">
                        <div className="od-overlay-content">
                          <h3 className="od-overlay-title">{offer.title}</h3>
                          {offer.subtitle && (
                            <p className="od-overlay-subtitle">{offer.subtitle}</p>
                          )}
                          {offer.blurb && (
                            <p className="od-overlay-blurb">{offer.blurb}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersDeck;
