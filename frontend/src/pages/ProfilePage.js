import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout.js';
import useAuth from '../hooks/useAuth.js';
import { http } from '../api/http.js';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    address: '',
    age: '',
  });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName ?? '',
        email: user.email,
        contactNumber: user.contactNumber ?? '',
        address: user.address ?? '',
        age: user.age?.toString() ?? '',
      });
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await http.put('/profile', {
        fullName: form.fullName,
        contactNumber: form.contactNumber || undefined,
        address: form.address || undefined,
        age: form.age ? Number(form.age) : undefined,
      });
      await refreshProfile();
      setStatus('Profile updated successfully.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <section style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '28px', padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', color: '#6b6074' }}>Patient Information</p>
            <h2 style={{ margin: '0.35rem 0 0' }}>{user?.fullName}</h2>
          </div>
          <span className="status-pill">ID: {user?.id}</span>
        </header>
        <form onSubmit={handleSubmit} className="profile-grid">
          <div className="profile-input">
            <label>Full Name</label>
            <input className="input-field" value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} required />
          </div>
          <div className="profile-input">
            <label>Email Address</label>
            <input className="input-field" value={form.email} disabled />
          </div>
          <div className="profile-input">
            <label>Contact Number</label>
            <input className="input-field" value={form.contactNumber} onChange={(e) => setForm((prev) => ({ ...prev, contactNumber: e.target.value }))} />
          </div>
          <div className="profile-input">
            <label>Address</label>
            <input className="input-field" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
          </div>
          <div className="profile-input">
            <label>Age</label>
            <input className="input-field" type="number" value={form.age} onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))} min={1} max={120} />
          </div>
          <div className="profile-input" style={{ alignSelf: 'flex-end' }}>
            <label style={{ visibility: 'hidden' }}>Save</label>
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
        {status && (
          <p style={{ marginTop: '1rem', color: status.includes('successfully') ? '#1c8d4c' : '#c0392b', fontWeight: 600 }}>
            {status}
          </p>
        )}
      </section>
    </AppLayout>
  );
};

export default ProfilePage;


