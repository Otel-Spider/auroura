import React from 'react';

const CalendarGrid = ({ 
  currentMonth, 
  selectedDates = { start: null, end: null },
  onDateSelect,
  hoverDate = null
}) => {
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const isDateSelected = (day) => {
    if (!day) return false;
    const date = new Date(year, month, day);
    const dateStr = date.toDateString();
    return selectedDates.start?.toDateString() === dateStr || 
           selectedDates.end?.toDateString() === dateStr;
  };
  
  const isDateInRange = (day) => {
    if (!day || !selectedDates.start || !selectedDates.end) return false;
    const date = new Date(year, month, day);
    return date > selectedDates.start && date < selectedDates.end;
  };
  
  const isDateInHoverRange = (day) => {
    if (!day || !selectedDates.start || !hoverDate) return false;
    const date = new Date(year, month, day);
    const start = selectedDates.start < hoverDate ? selectedDates.start : hoverDate;
    const end = selectedDates.start < hoverDate ? hoverDate : selectedDates.start;
    return date > start && date < end;
  };
  
  const isToday = (day) => {
    if (!day) return false;
    const date = new Date(year, month, day);
    return date.toDateString() === today.toDateString();
  };
  
  const isPastDate = (day) => {
    if (!day) return false;
    const date = new Date(year, month, day);
    return date < today;
  };
  
  const handleDateClick = (day) => {
    if (!day || isPastDate(day)) return;
    
    const date = new Date(year, month, day);
    onDateSelect(date);
  };
  
  const handleDateHover = (day) => {
    if (!day || isPastDate(day)) return;
    
    const date = new Date(year, month, day);
    onDateSelect(date, 'hover');
  };
  
  return (
    <div className="calendar-grid">
      {/* Day names header */}
      <div className="calendar-header">
        {dayNames.map(day => (
          <div key={day} className="calendar-day-name">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="calendar-days">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            className={`calendar-day ${
              !day ? 'calendar-day--empty' : ''
            } ${
              isDateSelected(day) ? 'calendar-day--selected' : ''
            } ${
              isDateInRange(day) ? 'calendar-day--in-range' : ''
            } ${
              isDateInHoverRange(day) ? 'calendar-day--hover-range' : ''
            } ${
              isToday(day) ? 'calendar-day--today' : ''
            } ${
              isPastDate(day) ? 'calendar-day--past' : ''
            }`}
            onClick={() => handleDateClick(day)}
            onMouseEnter={() => handleDateHover(day)}
            disabled={!day || isPastDate(day)}
            aria-label={day ? `${day} ${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
