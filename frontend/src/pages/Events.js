import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHospitalUser, FaNewspaper, FaMicrophoneAlt, FaSyringe, FaHandsHelping,
  FaMapPin, FaRegCalendarCheck, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { http } from '../api/http.js';
import BackButton from '../components/BackButton.js';
import Footer from '../components/Footer.js';
import "./Events.css";

// --- Helper: Calendar Component ---
const Calendar = ({ month, year }) => {
  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay(); // 0 for Sunday

  const totalDays = daysInMonth(month, year);
  const startDay = firstDayOfMonth(month, year);
  
  const days = [];
  
  // Add empty cells for days before the 1st
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  // Example hardcoded special dates (using Month-Day format)
  const specialDates = {
    // Assuming the calendar is showing August (month index 7) as in the image
    '7-4': 'highlight-orange',
    '7-11': 'highlight-orange',
    '7-17': 'highlight-purple',
    '7-24': 'highlight-purple',
    '7-20': 'highlight-yellow',
    '7-21': 'highlight-yellow',
    '7-27': 'highlight-yellow',
    '7-28': 'highlight-yellow',
    '7-29': 'highlight-yellow',
    '7-30': 'highlight-yellow',
  };

  // Add actual days
  for (let i = 1; i <= totalDays; i++) {
    const key = `${month}-${i}`;
    const highlightClass = specialDates[key] || '';
    const isToday = new Date().getDate() === i && new Date().getMonth() === month && new Date().getFullYear() === year;

    days.push(
      <div 
        key={`day-${i}`} 
        className={`calendar-day ${highlightClass} ${isToday ? 'today' : ''}`} 
      >
        {i}
      </div>
    );
  }

  return (
    <div className="calendar-grid">
      {/* Days of week headers adjusted to match the image: SN, MO, TU, WE, TH, FR, SA */}
      {['SN', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
        <div key={day} className="calendar-weekday-header">{day}</div>
      ))}
      {days}
    </div>
  );
};

// --- Main Events Page Component ---
export default function Events() {
  const navigate = useNavigate();
  
  // State for calendar (Defaults to current month/year)
  const [date, setDate] = useState(new Date());
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  // State for active event filter category
  const [activeCategory, setActiveCategory] = useState('All Events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data } = await http.get('/events');
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Transform events from backend to display format
  const upcomingEvents = events.map(event => {
    const eventDate = new Date(event.event_date);
    const monthAbbr = monthNames[eventDate.getMonth()].substring(0, 3).toUpperCase();
    const day = eventDate.getDate();
    return {
      id: event.id,
      month: monthAbbr,
      day: day,
      title: event.title,
      time: event.location || 'TBA',
      description: event.description,
      location: event.location
    };
  });

  const eventCategories = [
    { name: 'All Events', icon: FaRegCalendarCheck, color: '#6a6cff' },
    { name: 'Seminars', icon: FaMicrophoneAlt, color: '#4ac1ff' },
    { name: 'Vaccination', icon: FaSyringe, color: '#f7d04e' },
    { name: 'Community Outreach', icon: FaHandsHelping, color: '#e86a6c' },
  ];

  const goToPrevMonth = () => {
    setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  return (
    <div className="events-page-container">
      <header className="events-header">
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
          <FaNewspaper className="title-icon" />
          <h1>Events</h1>
        </div>
      </header>
      <div style={{ padding: '0 2rem 1rem' }}>
        <BackButton fallback="/dashboard" />
      </div>

      <main className="events-main-content">
        
        {/* Left Column: Event Filters */}
        <div className="event-filters-card">
          <button className="all-events-btn">All Events</button>
          <div className="filter-list">
            {eventCategories.map((category, index) => (
              <button
                key={category.name}
                className={`filter-item ${activeCategory === category.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.name)}
              >
                <span 
                  className="filter-color-dot" 
                  style={{ backgroundColor: category.color }}
                  data-index={index} // Used for CSS specific active border color
                ></span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Middle Column: Calendar */}
        <div className="calendar-card">
          <div className="calendar-nav">
            <button onClick={goToPrevMonth}><FaChevronLeft /></button>
            <span>{monthNames[currentMonth]} {currentYear}</span>
            <button onClick={goToNextMonth}><FaChevronRight /></button>
          </div>
          <Calendar 
            month={currentMonth} 
            year={currentYear} 
          />
        </div>

        {/* Right Column: Upcoming Events */}
        <div className="upcoming-events-card">
          <h2>Upcoming Events</h2>
          {loading ? (
            <p>Loading events...</p>
          ) : upcomingEvents.length === 0 ? (
            <p>No upcoming events scheduled.</p>
          ) : (
            <div className="upcoming-event-list">
              {upcomingEvents.map(event => (
                <div key={event.id} className="upcoming-event-item">
                  <div className="event-date">
                    <span className="event-month">{event.month}</span>
                    <span className="event-day">{event.day}</span>
                  </div>
                  <div className="event-details">
                    <p className="event-title">{event.title}</p>
                    {event.description && (
                      <p className="event-description" style={{ fontSize: '0.85rem', color: '#666', marginTop: 4 }}>
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <p className="event-time">
                        <FaMapPin style={{marginRight: '5px', color: '#e86a6c'}} /> {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}