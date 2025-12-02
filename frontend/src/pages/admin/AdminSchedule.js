import React, { useCallback, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import AdminPageHeader from '../../components/AdminPageHeader.js';
import useAutoRefresh from '../../hooks/useAutoRefresh.js';
import { http } from '../../api/http.js';

export default function AdminSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [restrictedSlots, setRestrictedSlots] = useState({}); // { "provider-day-time": true }

  const daysOfWeek = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' }
  ];

  // Generate time slots (30-minute intervals from 8:00 AM to 6:00 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatTime(timeStr);
        slots.push({ time: timeStr, display: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      try {
        const { data: providersData } = await http.get('/admin/providers');
        setProviders(Array.isArray(providersData) ? providersData : []);
        if (providersData.length > 0) {
          setSelectedProvider((prev) => prev || providersData[0].id.toString());
        }
      } catch (err) {
        console.warn('Could not load providers:', err);
        setProviders([]);
      }

      try {
        const { data: scheduleData } = await http.get('/admin/schedules');
        setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
      } catch (err) {
        console.warn('Could not load schedules:', err);
        setSchedules([]);
      }

      try {
        const { data: restrictedData } = await http.get('/admin/restricted-slots');
        if (restrictedData && Array.isArray(restrictedData)) {
          const restrictedMap = {};
          restrictedData.forEach((slot) => {
            const key = `${slot.provider_id}-${slot.day_of_week}-${slot.time}`;
            restrictedMap[key] = true;
          });
          setRestrictedSlots(restrictedMap);
        }
      } catch (err) {
        console.log('Restricted slots endpoint not available yet');
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const { lastUpdated, isRefreshing, manualRefresh } = useAutoRefresh(loadData, 60000);

  const getProviderName = (providerId) => {
    const provider = providers.find(p => p.id === providerId || p.id === parseInt(providerId));
    return provider ? (provider.full_name || provider.fullName) : `Provider #${providerId}`;
  };

  // Get schedules for selected provider and day
  const getScheduleForDay = (dayValue) => {
    if (!selectedProvider) return null;
    return schedules.find(s => 
      s.provider_id === parseInt(selectedProvider) && 
      s.day_of_week === dayValue
    );
  };

  // Check if a time slot is within the schedule range
  const isTimeInSchedule = (time, schedule) => {
    if (!schedule) return false;
    const [timeHour, timeMin] = time.split(':').map(Number);
    const [startHour, startMin] = schedule.start_time.split(':').map(Number);
    const [endHour, endMin] = schedule.end_time.split(':').map(Number);
    
    const timeMinutes = timeHour * 60 + timeMin;
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
  };

  // Check if a time slot is restricted
  const isSlotRestricted = (dayValue, time) => {
    if (!selectedProvider) return false;
    const key = `${selectedProvider}-${dayValue}-${time}`;
    return restrictedSlots[key] === true;
  };

  // Toggle slot restriction
  const toggleSlotRestriction = async (dayValue, time) => {
    if (!selectedProvider) {
      alert('Please select a provider first');
      return;
    }

    const key = `${selectedProvider}-${dayValue}-${time}`;
    const isRestricted = restrictedSlots[key] === true;
    const newRestrictedSlots = { ...restrictedSlots };

    try {
      if (isRestricted) {
        // Remove restriction
        delete newRestrictedSlots[key];
        await http.delete(`/admin/restricted-slots/${selectedProvider}/${dayValue}/${time}`);
      } else {
        // Add restriction
        newRestrictedSlots[key] = true;
        await http.post('/admin/restricted-slots', {
          provider_id: parseInt(selectedProvider),
          day_of_week: dayValue,
          time: time
        });
      }
      setRestrictedSlots(newRestrictedSlots);
    } catch (err) {
      console.error('Error toggling slot restriction:', err);
      alert('Error updating slot: ' + (err.response?.data?.message || err.message));
    }
  };

  const getSlotStatus = (dayValue, time) => {
    const schedule = getScheduleForDay(dayValue);
    if (!schedule) return 'no-schedule';
    if (!isTimeInSchedule(time, schedule)) return 'outside';
    if (isSlotRestricted(dayValue, time)) return 'restricted';
    return 'available';
  };

  const refreshDescriptor = lastUpdated
    ? `Updated • ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing…';

  return (
    <AppLayout>
      <div className="admin-panel">
        <AdminPageHeader
          title="Schedule"
          subtitle="Admin Portal / Schedule"
          description="Toggle availability across providers and quickly block clinic downtime."
          actions={
            <>
              <div className="refresh-pill">⟳ {isRefreshing ? 'Refreshing…' : refreshDescriptor}</div>
              <button className="secondary-btn" onClick={manualRefresh}>
                Refresh
              </button>
            </>
          }
        />

        <div className="admin-panel" style={{ marginTop: 0 }}>
          <label style={{ display: 'block', fontWeight: 600 }}>
            Select Provider
            <select
              value={selectedProvider}
              onChange={(event) => setSelectedProvider(event.target.value)}
              style={{
                width: '100%',
                padding: 12,
                marginTop: 8,
                fontSize: '1rem',
                borderRadius: 16,
                border: '1px solid #ddd',
              }}
            >
              <option value="">Select Provider</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name || p.fullName} ({p.email})
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading schedules…</div>
        ) : !selectedProvider ? (
          <div className="admin-panel" style={{ marginTop: 16 }}>
            <p>Select a provider to view and edit their availability.</p>
          </div>
        ) : (
          <div className="admin-panel" style={{ marginTop: 16, overflowX: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>Schedule for {getProviderName(selectedProvider)}</h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px repeat(7, 1fr)',
                gap: 8,
                minWidth: '800px',
              }}
            >
              {/* Time column header */}
              <div style={{ 
                padding: 12, 
                background: '#f5f5f5', 
                fontWeight: 600,
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: 6
              }}>
                Time
              </div>
              
              {/* Day headers */}
              {daysOfWeek.map(day => (
                <div key={day.value} style={{ 
                  padding: 12, 
                  background: '#f5f5f5', 
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid #ddd',
                  borderRadius: 6
                }}>
                  <div>{day.short}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>
                    {getScheduleForDay(day.value) 
                      ? `${getScheduleForDay(day.value).start_time} - ${getScheduleForDay(day.value).end_time}`
                      : 'No schedule'
                    }
                  </div>
                </div>
              ))}

              {/* Time slots */}
              {timeSlots.map((slot, idx) => (
                <React.Fragment key={slot.time}>
                  {/* Time label */}
                  <div style={{ 
                    padding: 8, 
                    background: idx % 2 === 0 ? '#fafafa' : 'white',
                    textAlign: 'right',
                    fontSize: '0.85rem',
                    color: '#666',
                    border: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}>
                    {slot.display}
                  </div>
                  
                  {/* Day cells */}
                  {daysOfWeek.map(day => {
                    const status = getSlotStatus(day.value, slot.time);
                    const isClickable = status === 'available' || status === 'restricted';
                    
                    return (
                      <div
                        key={`${day.value}-${slot.time}`}
                        onClick={() => isClickable && toggleSlotRestriction(day.value, slot.time)}
                        style={{
                          padding: 8,
                          background: 
                            status === 'restricted' ? '#e74c3c' :
                            status === 'available' ? '#27ae60' :
                            status === 'outside' ? '#ecf0f1' :
                            '#bdc3c7',
                          color: status === 'restricted' || status === 'available' ? 'white' : '#666',
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          border: '1px solid #ddd',
                          cursor: isClickable ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                          opacity: status === 'no-schedule' ? 0.5 : 1,
                          position: 'relative'
                        }}
                        title={
                          status === 'restricted' ? 'Click to make available' :
                          status === 'available' ? 'Click to restrict' :
                          status === 'outside' ? 'Outside schedule hours' :
                          'No schedule for this day'
                        }
                      >
                        {status === 'restricted' && '🚫'}
                        {status === 'available' && '✓'}
                        {status === 'outside' && '—'}
                        {status === 'no-schedule' && '○'}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Legend */}
            <div style={{ 
              marginTop: 20, 
              padding: 15, 
              background: '#f9f9f9', 
              borderRadius: 6,
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 20, background: '#27ae60', borderRadius: 4 }}></div>
                <span style={{ fontSize: '0.9rem' }}>Available (click to restrict)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 20, background: '#e74c3c', borderRadius: 4 }}></div>
                <span style={{ fontSize: '0.9rem' }}>Restricted (click to make available)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 20, background: '#ecf0f1', borderRadius: 4 }}></div>
                <span style={{ fontSize: '0.9rem' }}>Outside schedule hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 20, background: '#bdc3c7', borderRadius: 4, opacity: 0.5 }}></div>
                <span style={{ fontSize: '0.9rem' }}>No schedule for this day</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
