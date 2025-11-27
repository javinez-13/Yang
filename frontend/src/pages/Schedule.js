import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHospitalUser, FaCalendarCheck, FaPhoneAlt, FaFacebook, FaInstagram,
  FaEnvelope, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Schedule.css";

// --- Helper: Calendar Component (No change needed from previous version) ---
const Calendar = ({ month, year, selectedDate, onDateSelect }) => {
  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay(); // 0 for Sunday

  const totalDays = daysInMonth(month, year);
  const startDay = firstDayOfMonth(month, year);
  
  const days = [];
  
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  const availableDates = {
    '7-6': 'available-blue',
    '7-10': 'available-blue',
    '7-11': 'available-blue',
    '7-12': 'available-blue',
    '7-14': 'available-green',
    '7-17': 'available-green',
    '7-18': 'available-green',
    '7-24': 'available-green',
    '7-25': 'available-blue',
    '7-29': 'available-blue',
  };

  for (let i = 1; i <= totalDays; i++) {
    const key = `${month}-${i}`;
    const highlightClass = availableDates[key] || '';
    const isSelected = selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === month;
    const isToday = new Date().getDate() === i && new Date().getMonth() === month && new Date().getFullYear() === year;

    days.push(
      <div 
        key={`day-${i}`} 
        className={`calendar-day ${highlightClass} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
        onClick={() => onDateSelect(new Date(year, month, i))}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="calendar-grid">
      {['SN', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
        <div key={day} className="calendar-weekday-header">{day}</div>
      ))}
      {days}
    </div>
  );
};

// --- NEW Helper: TimeSlotOverlay Component ---
const TimeSlotOverlay = ({ baseTime, selectedExactTime, onExactTimeSelect, onClose }) => {
  const getMinuteSlots = (hourString) => {
    const [time, period] = hourString.split(' '); // e.g., "08:00", "AM"
    let [hour, minute] = time.split(':').map(Number);
    
    const slots = [];
    for (let i = 0; i < 60; i += 5) { // Generate slots every 5 minutes
      let currentHour = hour;
      let currentPeriod = period;

      if (currentHour === 12 && period === 'PM' && i > 0) { // Handle 12:00 PM to 12:05 PM etc.
         // No change to period
      } else if (currentHour === 12 && period === 'AM' && i > 0) { // Handle 12:00 AM to 12:05 AM etc.
         // No change to period
      } else if (currentHour === 11 && period === 'AM' && i >= 30) { // e.g., 11:30 AM should still be AM
          // No change
      } else if (currentHour === 11 && period === 'PM' && i >= 30) { // e.g., 11:30 PM should still be PM
          // No change
      }
      
      const slotHour = String(currentHour).padStart(2, '0');
      const slotMinute = String(i).padStart(2, '0');
      slots.push(`${slotHour}:${slotMinute} ${currentPeriod}`);
    }
    return slots;
  };

  const minuteSlots = getMinuteSlots(baseTime);

  return (
    <div className="time-slot-overlay">
      {/* <div className="overlay-close-btn" onClick={onClose}>&times;</div> */}
      {minuteSlots.map(slot => (
        <button
          key={slot}
          className={`minute-slot-btn ${selectedExactTime === slot ? 'selected' : ''}`}
          onClick={() => onExactTimeSelect(slot)}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};

// --- Main Schedule Page Component ---
export default function Schedule() {
  const navigate = useNavigate();
  
  // State for calendar
  const [date, setDate] = useState(new Date());
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // State for booking form
  const [selectedService, setSelectedService] = useState('General Consultation');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // e.g., "08:00 AM"
  const [selectedExactTime, setSelectedExactTime] = useState(null); // e.g., "08:05 AM"

  // NEW state for managing the overlay visibility
  const [hoveredTimeSlot, setHoveredTimeSlot] = useState(null);


  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

  const serviceTypes = [
    "General Consultation",
    "Teeth Cleaning",
    "Vaccination",
  ];

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"
  ];

  const goToPrevMonth = () => {
    setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    setSelectedCalendarDate(null);
    setSelectedTimeSlot(null);
    setSelectedExactTime(null); // Clear exact time
    setHoveredTimeSlot(null); // Clear overlay
  };

  const goToNextMonth = () => {
    setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    setSelectedCalendarDate(null);
    setSelectedTimeSlot(null);
    setSelectedExactTime(null); // Clear exact time
    setHoveredTimeSlot(null); // Clear overlay
  };

  const handleBookingConfirm = () => {
    const finalTime = selectedExactTime || selectedTimeSlot; // Use exact time if selected, else main slot
    if (selectedService && selectedCalendarDate && finalTime) {
      alert(`Booking confirmed for:\nService: ${selectedService}\nDate: ${selectedCalendarDate.toDateString()}\nTime: ${finalTime}`);
    } else {
      alert("Please select a service, date, and time slot to confirm your booking.");
    }
  };

  // Function to handle clicking a main time slot button
  const handleMainTimeSlotClick = (slot) => {
    setSelectedTimeSlot(slot);
    setSelectedExactTime(slot); // Default to the main slot if no minute slot is chosen
    setHoveredTimeSlot(null); // Close overlay after selection
  };

  // Function to handle selecting an exact minute slot
  const handleExactTimeSelect = (slot) => {
    // We update selectedTimeSlot to the *main* hour, and selectedExactTime to the *specific* minute.
    // This allows the main button to stay highlighted with the hour, but the booking uses the minute.
    setSelectedExactTime(slot);
    // You might want to automatically close the overlay here
    setHoveredTimeSlot(null);
  };

  return (
    <div className="schedule-page-container">
      {/* Header (No changes) */}
      <header className="schedule-header">
        <div className="logo">
          <span className="logo-icon-container">
            <FaHospitalUser className="logo-icon" />
          </span>
          <div className="logo-text">
            <span className="logo-main-text">YangConnect</span>
            <span className="logo-sub-text">Health Portal</span>
          </div>
        </div>

        <div className="header-title">
          <FaCalendarCheck className="title-icon" />
          <h1>Schedule</h1>
        </div>

        <a href="/dashboard" className="home-btn" aria-label="Home">🏠</a>
      </header>

      {/* Main Content Area */}
      <main className="schedule-main-content">
        
        {/* Left Column: Book Appointment (Service Type) (No changes) */}
        <div className="booking-card">
          <h2>Book Appointment</h2>
          <div className="service-type-section">
            <p className="section-label">Service Type</p>
            <div className="radio-group">
              {serviceTypes.map(service => (
                <label key={service} className="radio-label">
                  <input
                    type="radio"
                    name="serviceType"
                    value={service}
                    checked={selectedService === service}
                    onChange={(e) => setSelectedService(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  {service}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Calendar (No changes) */}
        <div className="calendar-card">
          <div className="calendar-nav">
            <button onClick={goToPrevMonth}><FaChevronLeft /></button>
            <span>{monthNames[currentMonth]} {currentYear}</span>
            <button onClick={goToNextMonth}><FaChevronRight /></button>
          </div>
          <Calendar 
            month={currentMonth} 
            year={currentYear} 
            selectedDate={selectedCalendarDate}
            onDateSelect={setSelectedCalendarDate}
          />
        </div>

        {/* Right Column: Available Time Slots (MODIFIED) */}
        <div className="time-slots-card">
          <h2>Available Time Slots</h2>
          <div className="time-slots-grid">
            {timeSlots.map(slot => (
              <div 
                key={slot} 
                className="time-slot-wrapper" // Wrapper for positioning overlay
                onMouseEnter={() => setHoveredTimeSlot(slot)}
                onMouseLeave={() => setHoveredTimeSlot(null)}
              >
                <button
                  className={`time-slot-btn ${
                    (selectedTimeSlot === slot && !selectedExactTime) || // Main slot selected and no minute selected
                    (selectedExactTime && selectedExactTime.startsWith(slot.substring(0, 5))) // Minute slot selected within this hour
                    ? 'selected' : ''
                  }`}
                  onClick={() => handleMainTimeSlotClick(slot)}
                >
                  {slot}
                </button>
                {/* Conditionally render overlay when hovered */}
                {hoveredTimeSlot === slot && (
                  <TimeSlotOverlay 
                    baseTime={slot} 
                    selectedExactTime={selectedExactTime}
                    onExactTimeSelect={handleExactTimeSelect}
                    onClose={() => setHoveredTimeSlot(null)}
                  />
                )}
              </div>
            ))}
          </div>
          <button 
            className="confirm-booking-btn"
            onClick={handleBookingConfirm}
            disabled={!selectedService || !selectedCalendarDate || (!selectedTimeSlot && !selectedExactTime)}
          >
            Confirm Booking
          </button>
        </div>
      </main>

      {/* Footer (No changes) */}
      <footer className="schedule-footer">
        <div className="footer-left">
          <FaPhoneAlt className="phone-icon" />
          <p>24/7 Hotline: 1-800-HEALTH (432584)</p>
        </div>

        <div className="footer-middle">
          <FaFacebook className="social-icon" />
          <FaInstagram className="social-icon" />
          <FaXTwitter className="social-icon" />
        </div>

        <div className="footer-right">
          <FaEnvelope className="mail-icon" />
          <p>yangconnect@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}