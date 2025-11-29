import React, { useEffect, useState } from 'react';
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
import { http } from '../api/http.js';
import "./OrganizationalChart.css";

// --- Reusable Node Component ---
// Applies the gradient box styling and handles the icon and title display.
const ChartNode = ({ title, icon: Icon, className = "" }) => (
  <div className={`org-chart-node ${className}`}>
    <Icon className="node-icon" />
    <span className="node-title">{title}</span>
  </div>
);

// Icon mapping for different roles
const getIconForRole = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('director') || lowerName.includes('executive')) return FaHospitalUser;
  if (lowerName.includes('medicine') || lowerName.includes('doctor')) return FaUserMd;
  if (lowerName.includes('administration') || lowerName.includes('admin')) return FaUserTie;
  if (lowerName.includes('nursing') || lowerName.includes('nurse')) return FaUserNurse;
  if (lowerName.includes('pediatric') || lowerName.includes('baby')) return FaBaby;
  if (lowerName.includes('cardiac') || lowerName.includes('heart')) return FaHeartbeat;
  return FaHospitalUser; // default
};

export default function OrganizationalChart() {
  const [orgUnits, setOrgUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrgChart = async () => {
      try {
        const { data } = await http.get('/org-chart');
        console.log('Org chart data received:', data);
        if (Array.isArray(data) && data.length > 0) {
          setOrgUnits(data);
        } else {
          console.warn('No organizational chart data received');
          setOrgUnits([]);
        }
      } catch (err) {
        console.error('Error loading organizational chart:', err);
        setOrgUnits([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrgChart();
  }, []);

  // Build hierarchical structure
  const buildHierarchy = () => {
    if (orgUnits.length === 0) {
      return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>No organizational chart data available.</div>;
    }

    // Filter root units (those without parent_id or with null parent_id)
    const rootUnits = orgUnits.filter(u => u.parent_id === null || u.parent_id === undefined || u.parent_id === 0);
    const childrenMap = {};
    
    // Build children map - convert parent_id to number for consistent comparison
    orgUnits.forEach(unit => {
      const parentId = unit.parent_id;
      if (parentId !== null && parentId !== undefined && parentId !== 0) {
        const parentKey = typeof parentId === 'string' ? parseInt(parentId) : parentId;
        if (!childrenMap[parentKey]) {
          childrenMap[parentKey] = [];
        }
        childrenMap[parentKey].push(unit);
      }
    });
    
    console.log('Root units:', rootUnits);
    console.log('Children map:', childrenMap);

    const renderLevel = (units, level = 1) => {
      if (units.length === 0) return null;

      return (
        <div key={`level-${level}`} className={`chart-node-group ${level === 1 ? 'group-level-2' : level === 2 ? 'group-level-3' : ''}`}>
          {level === 1 ? (
            <div className="chart-sibling-connect">
              {units.map(unit => (
                <ChartNode 
                  key={unit.id}
                  title={unit.name} 
                  icon={getIconForRole(unit.name)} 
                />
              ))}
            </div>
          ) : (
            <div className="chart-sibling-connect">
              {units.map(unit => (
                <ChartNode 
                  key={unit.id}
                  title={unit.name} 
                  icon={getIconForRole(unit.name)} 
                />
              ))}
            </div>
          )}
          {units.map(unit => {
            const unitId = typeof unit.id === 'string' ? parseInt(unit.id) : unit.id;
            const children = childrenMap[unitId] || [];
            return children.length > 0 ? (
              <div key={`children-${unit.id}`} className={level === 1 ? 'node-group-vertical-align' : ''}>
                {renderLevel(children, level + 1)}
              </div>
            ) : null;
          })}
        </div>
      );
    };

    // Find root unit (usually the first one or one without parent)
    const rootUnit = rootUnits.length > 0 ? rootUnits[0] : null;
    
    if (!rootUnit) {
      return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>No root organizational unit found.</div>;
    }
    
    return (
      <>
        <div className="chart-level-1">
          <ChartNode 
            title={rootUnit.name} 
            icon={getIconForRole(rootUnit.name)} 
            className="top-node" 
          />
        </div>
        {rootUnits.length > 1 && renderLevel(rootUnits.slice(1), 1)}
        {(() => {
          const rootId = typeof rootUnit.id === 'string' ? parseInt(rootUnit.id) : rootUnit.id;
          return childrenMap[rootId] && childrenMap[rootId].length > 0 && renderLevel(childrenMap[rootId], 1);
        })()}
      </>
    );
  };

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
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading organizational chart...</div>
            ) : (
              buildHierarchy()
            )}
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