import React, { useState } from 'react';
import CalendarGrid from './CalendarGrid';
import CounterButton from './CounterButton';

const TwoMonthCalendar = ({ 
  currentMonth, 
  selectedDates = { start: null, end: null },
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  onReset
}) => {
  const [hoverDate, setHoverDate] = useState(null);
  
  // Calculate next month
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  
  const handleDateSelect = (date, action = 'click') => {
    if (action === 'hover') {
      // Only show hover tracking if we don't have a complete selection
      if (!selectedDates.start || !selectedDates.end) {
        setHoverDate(date);
      }
    } else {
      setHoverDate(null);
      onDateSelect(date);
    }
  };
  
  const handleReset = () => {
    setHoverDate(null);
    onReset();
  };
  
  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const calculateNights = () => {
    if (!selectedDates.start || !selectedDates.end) return 0;
    const timeDiff = selectedDates.end.getTime() - selectedDates.start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  
  const nights = calculateNights();
  
  return (
    <div className="two-month-calendar">
      {/* Single Header with Navigation */}
      <div className="calendar-header-nav">
        <CounterButton
          kind="chev"
          aria-label="Previous month"
          onClick={onPrevMonth}
        />
        <div className="calendar-header-title">
          {formatMonth(currentMonth)} & {formatMonth(nextMonth)}
        </div>
        <CounterButton
          kind="chev"
          aria-label="Next month"
          onClick={onNextMonth}
          style={{ transform: "rotate(180deg)" }}
        />
      </div>
      
      {/* Calendar Grids */}
      <div className="calendar-months">
        <div className="calendar-month">
          <CalendarGrid
            currentMonth={currentMonth}
            selectedDates={selectedDates}
            onDateSelect={handleDateSelect}
            hoverDate={hoverDate}
          />
        </div>
        
        <div className="calendar-month">
          <CalendarGrid
            currentMonth={nextMonth}
            selectedDates={selectedDates}
            onDateSelect={handleDateSelect}
            hoverDate={hoverDate}
          />
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="calendar-summary">
        <hr className="calendar-divider" />
        <div className="summary-content">
          <div className="summary-left">
            <div className="calendar-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="currentColor"/>
                <path d="M7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10ZM7 14H9V16H7V14ZM11 14H13V16H11V14ZM15 14H17V16H15V14Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="selected-dates">
              {selectedDates.start && selectedDates.end ? (
                <>
                  <span className="date-range">
                    {formatDate(selectedDates.start)} – {formatDate(selectedDates.end)}
                  </span>
                  <span className="nights-count">
                    {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                </>
              ) : selectedDates.start ? (
                <span className="date-range">
                  {formatDate(selectedDates.start)} – Select end date
                </span>
              ) : (
                <span className="date-range text-muted">
                  Select your dates
                </span>
              )}
            </div>
          </div>
          <button 
            className="reset-button"
            onClick={handleReset}
            disabled={!selectedDates.start && !selectedDates.end}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoMonthCalendar;
