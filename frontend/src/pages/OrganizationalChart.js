import React from 'react';
import {
  FaUserMd,
  FaUserNurse,
  FaHospitalUser,
  FaSitemap,
  FaPhoneAlt,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaUserTie,
  FaBaby,
  FaHeartbeat
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./OrganizationalChart.css";

// --- Reusable Node Component ---
// Applies the gradient box styling and handles the icon and title display.
const ChartNode = ({ title, icon: Icon, className = "" }) => (
  <div className={`org-chart-node ${className}`}>
    <Icon className="node-icon" />
    <span className="node-title">{title}</span>
  </div>
);

export default function OrganizationalChart() {
  return (
    // Base container for the soft pink background style
    <div className="org-chart-page">
      <div className="org-chart-container">
        
        {/* --- Header Area (Logo, Title, Home Button) --- */}
        <header className="org-header">
          {/* Logo Section */}
          <div className="logo">
            <span className="logo-icon-container">
              {/* Using FaHospitalUser icon for the logo graphic */}
              <FaHospitalUser className="logo-icon" />
            </span>
            <div className="logo-text">
                <span className="logo-main-text">YangConnect</span>
                <span className="logo-sub-text">Health Portal</span>
            </div>
          </div>

          {/* Title Section */}
          <div className="header-title">
            <h1 className="org-chart-title">Organizational Chart</h1>
          </div>

          {/* Home Button */}
          <a href="/dashboard" className="home-btn" aria-label="Home">🏠</a>
        </header>

        {/* --- Chart Layout Wrapper --- */}
        <div className="org-chart-wrapper">
          <div className="org-chart-scroll">

            {/* Level 1: Hospital Director (Root Node) */}
            <div className="chart-level-1">
              <ChartNode 
                title="Hospital Director" 
                icon={FaHospitalUser} 
                className="top-node" 
              />
            </div>
            
            {/* Level 2: Chiefs & Head (Sibling Row) */}
            {/* This div group creates the vertical line down to the sibling line */}
            <div className="chart-node-group group-level-2">
                {/* This div creates the horizontal line connecting the three siblings */}
                <div className="chart-sibling-connect">
                    <ChartNode title="Chief of Medicine" icon={FaUserMd} />
                    <ChartNode title="Chief of Administration" icon={FaUserTie} />
                    <ChartNode title="Head of Nursing" icon={FaUserNurse} />
                </div>
            </div>

            {/* Level 3: Department Heads */}
            {/* The CSS for .node-group-vertical-align will center this under the Chief of Administration */}
            <div className="chart-node-group node-group-vertical-align group-level-3">
              <div className="chart-sibling-connect">
                <ChartNode title="Department Head- Pediatrics" icon={FaBaby} />
                <ChartNode title="Department Head- Cardiology" icon={FaHeartbeat} />
              </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* --- Footer Area (Contact Info & Socials) --- */}
      <footer className="org-footer">
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