import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHospitalUser, FaBookmark, FaPhoneAlt, FaFacebook, FaInstagram,
  FaEnvelope, FaRegCircle, FaCheckCircle, FaPrint, FaRegClock
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Appointment.css"; // Import the CSS file
import appointmentIllustration from '../assets/appointment_illustration.jpg';
// Placeholder for a simple appointment illustration.
// You would put an actual image in your `src/assets` folder or similar.
// For now, I'll use a placeholder URL if the file isn't present.
// Make sure to create an 'assets' folder inside your components folder or adjust the path.
// If you use the actual image, rename it to appointment_illustration.png
const AppointmentIllustration = ({ className }) => (
    <img 
        src={appointmentIllustration} 
        alt="Appointment details illustration" 
        className={className} 
    />
);


// --- Main Appointment Page Component ---
export default function Appointment() {
  const navigate = useNavigate();
  
  // State for active filter categories
  const [activeFilters, setActiveFilters] = useState([
    'General Consultation', 'Teeth Cleaning', 'Vaccination'
  ]);

  const serviceTypes = [
    "General Consultation",
    "Teeth Cleaning",
    "Vaccination",
  ];

  // Placeholder for booked appointments data
  const bookedAppointments = [
    { 
      id: 1, 
      month: 'August', 
      day: '06', 
      service: 'General Consultation', 
      time: '10:00 AM',
      category: 'General Consultation' // Used for filtering
    },
    { 
      id: 2, 
      month: 'August', 
      day: '29', 
      service: 'Teeth Cleaning', 
      time: '08:00 AM',
      category: 'Teeth Cleaning' // Used for filtering
    },
    { 
      id: 3, 
      month: 'September', 
      day: '10', 
      service: 'Vaccination', 
      time: '08:00 AM',
      category: 'Vaccination' // Used for filtering
    },
  ];

  const toggleFilter = (filterName) => {
    setActiveFilters(prevFilters => 
      prevFilters.includes(filterName)
        ? prevFilters.filter(f => f !== filterName)
        : [...prevFilters, filterName]
    );
  };

  const filteredAppointments = bookedAppointments.filter(app => 
    activeFilters.includes(app.category)
  );

  return (
    <div className="appointment-page-container">
      {/* Header */}
      <header className="appointment-header">
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
          <FaBookmark className="title-icon" />
          <h1>BOOKED</h1>
        </div>

        <a href="/dashboard" className="home-btn" aria-label="Home">🏠</a>
      </header>

      {/* Main Content Area */}
      <main className="appointment-main-content">
        
        {/* Left Column: Booked Appointment Filters */}
        <div className="booked-appointment-filter-card">
          <h2>Booked Appointment</h2>
          <div className="service-type-section">
            <p className="section-label">Service Type</p>
            <div className="checkbox-group">
              {serviceTypes.map(service => (
                <label key={service} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(service)}
                    onChange={() => toggleFilter(service)}
                  />
                  <span className="custom-checkbox">
                    {activeFilters.includes(service) ? <FaCheckCircle /> : <FaRegCircle />}
                  </span>
                  {service}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Appointments List and Illustration */}
        <div className="appointments-display-area">
            <div className="appointments-list-container">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(app => (
                        <div key={app.id} className="appointment-item-card">
                            <div className="appointment-header-info">
                                <span className="appointment-month-icon">
                                    <FaRegCircle className="month-circle-icon" /> 
                                    {app.month}
                                </span>
                                <span className="appointment-time-info">
                                    <FaRegClock className="time-icon" />
                                    {app.time}
                                </span>
                            </div>
                            <p className="appointment-day-service">
                                <span className="appointment-day">{app.day}</span>
                                <span className="appointment-service">{app.service}</span>
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="no-appointments">No appointments matching your filters.</p>
                )}
            </div>
            
            <div className="illustration-print-section">
                <AppointmentIllustration className="appointment-illustration" />
                <button className="print-btn" onClick={() => window.print()}>
                    <FaPrint className="print-icon" />
                </button>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="appointment-footer">
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