import React, { useState, useEffect } from 'react';
import '../../assets/css/home/booking-bar.css';
import GuestsDropdown from './GuestsDropdown';
import DateDropdown from './DateDropdown';
import TwoMonthCalendar from './TwoMonthCalendar';
import axios from 'axios';

const BookingBar = ({
  // Props for backward compatibility (will be overridden by API data)
  title: propTitle = "Book your next ALL Inclusive Collection experience",
  dateLabel: propDateLabel = "Dates",
  dateValue: propDateValue = "09 Oct – 14 Oct",
  guestsLabel: propGuestsLabel = "Rooms & Guests",
  guestsValue: propGuestsValue = "1 room – 2 guests",
  price: propPrice = { amount: "1444.95", currency: "USD", meta: "5 nights – 2 guests" },
  onOpenDates,
  onOpenGuests,
  onBook
}) => {
  // State for API data
  const [bookingBarData, setBookingBarData] = useState(null);
  // State for dropdown visibility
  const [showDatesDropdown, setShowDatesDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  // State for mobile off-canvas
  const [showMobileOffCanvas, setShowMobileOffCanvas] = useState(false);
  const [showMobileDates, setShowMobileDates] = useState(false);
  const [showMobileGuests, setShowMobileGuests] = useState(false);

  // State for guests
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // State for dates
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });

  // State for sticky behavior
  const [isSticky, setIsSticky] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [bookingBarRef, setBookingBarRef] = useState(null);

  // Load booking bar data from API
  useEffect(() => {
    const fetchBookingBarData = async () => {
      try {
        const response = await axios.get('/api/booking-bar/active');
        setBookingBarData(response.data);
      } catch (err) {
        console.error('Error fetching booking bar data:', err);
        // Use default props on error
      }
    };

    fetchBookingBarData();
  }, []);

  // Handle scroll effect for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      if (bookingBarRef) {
        const bookingBarRect = bookingBarRef.getBoundingClientRect();
        const scrollPosition = window.scrollY;
        const bookingBarBottom = scrollPosition + bookingBarRect.bottom;

        // Show sticky bar when we've scrolled past the original booking bar
        setIsSticky(scrollPosition > bookingBarBottom);

        // Check if near footer (footer is typically at the bottom of the page)
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const footerThreshold = 200; // Distance from footer to trigger top positioning

        // If we're within 200px of the footer, show at top
        setIsNearFooter(scrollPosition + windowHeight >= documentHeight - footerThreshold);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bookingBarRef]);

  // Use API data or fallback to props
  const title = bookingBarData?.title || propTitle;
  const dateLabel = bookingBarData?.date_label || propDateLabel;
  const dateValue = bookingBarData?.date_value || propDateValue;
  const guestsLabel = bookingBarData?.guests_label || propGuestsLabel;
  const guestsValue = bookingBarData?.guests_value || propGuestsValue;
  const ctaText = bookingBarData?.cta_text || 'BOOK NOW';
  const price = bookingBarData ? {
    currency: bookingBarData.price_currency,
    amount: bookingBarData.price_amount,
    meta: bookingBarData.price_meta
  } : propPrice;

  const handleOpenDates = () => {
    setShowDatesDropdown(!showDatesDropdown);
    setShowGuestsDropdown(false);
    if (onOpenDates) onOpenDates();
  };

  const handleOpenGuests = () => {
    setShowGuestsDropdown(!showGuestsDropdown);
    setShowDatesDropdown(false);
    if (onOpenGuests) onOpenGuests();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

  const handleDateSelect = (date) => {
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      setSelectedDates({ start: date, end: null });
    } else if (selectedDates.start && !selectedDates.end) {
      // Complete the selection
      if (date < selectedDates.start) {
        setSelectedDates({ start: date, end: selectedDates.start });
      } else {
        setSelectedDates({ start: selectedDates.start, end: date });
      }
    }
  };

  const handleResetDates = () => {
    setSelectedDates({ start: null, end: null });
  };

  // Mobile off-canvas handlers
  const handleMobileEdit = () => {
    setShowMobileOffCanvas(true);
    // Prevent body scroll while preserving scroll position
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  };

  const handleCloseMobileOffCanvas = () => {
    setShowMobileOffCanvas(false);
    setShowMobileDates(false);
    setShowMobileGuests(false);
    // Restore body scroll and position
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  };

  const handleShowMobileDates = () => {
    setShowMobileDates(true);
    setShowMobileGuests(false);
  };

  const handleShowMobileGuests = () => {
    setShowMobileGuests(true);
    setShowMobileDates(false);
  };

  const handleBackToOptions = () => {
    setShowMobileDates(false);
    setShowMobileGuests(false);
  };

  // Cleanup effect to restore body styles on unmount
  useEffect(() => {
    return () => {
      // Restore body styles if component unmounts while off-canvas is open
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, []);
  // Calendar icon component
  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="currentColor"/>
      <path d="M7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10ZM7 14H9V16H7V14ZM11 14H13V16H11V14ZM15 14H17V16H15V14Z" fill="currentColor"/>
    </svg>
  );

  // Caret icon component
  const CaretIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
    </svg>
  );

  // Edit icon component
  const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H16C17.11 20 18 19.11 18 18V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Back icon component
  const BackIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Close icon component
  const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <section aria-labelledby="booking-title" className="booking-section">
      <div className="booking-container">
        {/* Title */}
        <h2 id="booking-title" className="booking-title">
          {title}
        </h2>

        {/* Booking Card */}
        <div className="booking-card" ref={setBookingBarRef}>
          {/* Mobile Edit Button */}
          <button
            className="mobile-edit-btn"
            onClick={handleMobileEdit}
            aria-label="Edit booking details"
          >
            <EditIcon />
          </button>

          {/* Fields Container */}
          <div className="bk-fields">
            {/* Dates Field */}
            <div className="position-relative">
              <button
                type="button"
                className="bk-field bk-dates"
                onClick={handleOpenDates}
                aria-haspopup="dialog"
                aria-expanded={showDatesDropdown}
                aria-controls="dates-picker"
              >
                <div className="field-label">{dateLabel}</div>
                <div className="field-value">
                  <CalendarIcon />
                  <span className="value-text">{dateValue}</span>
                </div>
              </button>

              {showDatesDropdown && (
                <div className="datepicker-dropdown">
                  <DateDropdown
                    monthLabelLeft={formatMonth(currentMonth)}
                    monthLabelRight={formatMonth(nextMonth)}
                    onPrev={handlePrevMonth}
                    onNext={handleNextMonth}
                  >
                    <TwoMonthCalendar
                      currentMonth={currentMonth}
                      selectedDates={selectedDates}
                      onDateSelect={handleDateSelect}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
                      onReset={handleResetDates}
                    />
                  </DateDropdown>
                </div>
              )}
            </div>

            {/* Rooms & Guests Field */}
            <div className="position-relative">
              <button
                type="button"
                className="bk-field bk-guests"
                onClick={handleOpenGuests}
                aria-haspopup="dialog"
                aria-expanded={showGuestsDropdown}
                aria-controls="guests-picker"
              >
                <div className="field-label">{guestsLabel}</div>
                <div className="field-value">
                  <CaretIcon />
                  <span className="value-text">{guestsValue}</span>
                </div>
              </button>

              {showGuestsDropdown && (
                <div className="guests-dropdown">
                  <GuestsDropdown
                    rooms={rooms}
                    adults={adults}
                    children={children}
                    setRooms={setRooms}
                    setAdults={setAdults}
                    setChildren={setChildren}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Price & CTA */}
          <div className="bk-price">
            <div className="price-text">
              <div className="price-amount">
                <span className="currency">{price.currency}</span>
                <span className="amount">{price.amount}</span>
              </div>
              <div className="price-meta">{price.meta}</div>
            </div>
            <button
              type="button"
              className="bk-cta"
              onClick={onBook}
            >
              {ctaText}
            </button>
          </div>
        </div>

        {/* Mobile Off-Canvas */}
        {showMobileOffCanvas && (
          <div className="mobile-offcanvas-overlay" onClick={handleCloseMobileOffCanvas}>
            <div className="mobile-offcanvas" onClick={(e) => e.stopPropagation()}>
              {/* Off-canvas header */}
              <div className="offcanvas-header">
                {(showMobileDates || showMobileGuests) && (
                  <button className="back-btn" onClick={handleBackToOptions}>
                    <BackIcon />
                  </button>
                )}
                <h3 className="offcanvas-title">
                  {showMobileDates ? 'Select Dates' :
                   showMobileGuests ? 'Rooms & Guests' :
                   'Edit Booking'}
                </h3>
                <button className="close-btn" onClick={handleCloseMobileOffCanvas}>
                  <CloseIcon />
                </button>
              </div>

              {/* Off-canvas content */}
              <div className="offcanvas-content">
                {!showMobileDates && !showMobileGuests && (
                  // Main options
                  <div className="offcanvas-options">
                    <button className="option-btn" onClick={handleShowMobileDates}>
                      <div className="option-info">
                        <div className="option-label">Dates</div>
                        <div className="option-value">{dateValue}</div>
                      </div>
                      <CalendarIcon />
                    </button>
                    <button className="option-btn" onClick={handleShowMobileGuests}>
                      <div className="option-info">
                        <div className="option-label">Rooms & Guests</div>
                        <div className="option-value">{guestsValue}</div>
                      </div>
                      <CaretIcon />
                    </button>
                  </div>
                )}

                {showMobileDates && (
                  // Dates content
                  <div className="offcanvas-dates">
                    <DateDropdown
                      monthLabelLeft={formatMonth(currentMonth)}
                      monthLabelRight={formatMonth(nextMonth)}
                      onPrev={handlePrevMonth}
                      onNext={handleNextMonth}
                    >
                      <TwoMonthCalendar
                        currentMonth={currentMonth}
                        selectedDates={selectedDates}
                        onDateSelect={handleDateSelect}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handleNextMonth}
                        onReset={handleResetDates}
                      />
                    </DateDropdown>
                  </div>
                )}

                {showMobileGuests && (
                  // Guests content
                  <div className="offcanvas-guests">
                    <GuestsDropdown
                      rooms={rooms}
                      adults={adults}
                      children={children}
                      setRooms={setRooms}
                      setAdults={setAdults}
                      setChildren={setChildren}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Booking Bar (appears when scrolling) */}
      {isSticky && (
        <div className={`sticky-booking-bar ${isNearFooter ? 'sticky-top' : ''}`}>
          <div className="sticky-booking-container">
            <div className="sticky-booking-card">
              {/* Fields Container (hidden on mobile) */}
              <div className="bk-fields">
                {/* Dates Field */}
                <div className="position-relative">
                  <button
                    type="button"
                    className="bk-field bk-dates"
                    onClick={handleOpenDates}
                    aria-haspopup="dialog"
                    aria-expanded={showDatesDropdown}
                    aria-controls="dates-picker"
                  >
                    <div className="field-label">{dateLabel}</div>
                    <div className="field-value">
                      <CalendarIcon />
                      <span className="value-text">{dateValue}</span>
                    </div>
                  </button>
                </div>

                {/* Rooms & Guests Field */}
                <div className="position-relative">
                  <button
                    type="button"
                    className="bk-field bk-guests"
                    onClick={handleOpenGuests}
                    aria-haspopup="dialog"
                    aria-expanded={showGuestsDropdown}
                    aria-controls="guests-picker"
                  >
                    <div className="field-label">{guestsLabel}</div>
                    <div className="field-value">
                      <CaretIcon />
                      <span className="value-text">{guestsValue}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="bk-price">
                <div className="price-text">
                  <div className="price-amount">
                    <span className="currency">{price.currency}</span>
                    <span className="amount">{price.amount}</span>
                  </div>
                  <div className="price-meta">{price.meta}</div>
                </div>
                {/* Mobile Edit Button */}
                <button
                  className="mobile-edit-btn"
                  onClick={handleMobileEdit}
                  aria-label="Edit booking details"
                >
                  <EditIcon />
                </button>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                className="bk-cta"
                onClick={onBook}
              >
                {ctaText}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingBar;
