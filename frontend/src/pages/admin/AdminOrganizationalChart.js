import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import { http } from '../../api/http.js';

export default function AdminOrganizationalChart() {
  const [orgUnits, setOrgUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/admin/org-chart');
      setOrgUnits(data);
    } catch (err) {
      console.error('Error loading org chart:', err);
      // If endpoint doesn't exist, try to show empty state
      setOrgUnits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await http.put(`/admin/org-chart/${editingId}`, formData);
      } else {
        await http.post('/admin/org-chart', formData);
      }
      await loadData();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', parent_id: '' });
    } catch (err) {
      alert('Error saving organizational unit: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (unit) => {
    setEditingId(unit.id);
    setFormData({
      name: unit.name,
      description: unit.description || '',
      parent_id: unit.parent_id ? unit.parent_id.toString() : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this organizational unit?')) return;
    try {
      await http.delete(`/admin/org-chart/${id}`);
      await loadData();
    } catch (err) {
      alert('Error deleting organizational unit: ' + (err.response?.data?.message || err.message));
    }
  };

  const getParentName = (parentId) => {
    if (!parentId) return 'None (Root)';
    const parent = orgUnits.find(u => u.id === parentId);
    return parent ? parent.name : `Unit #${parentId}`;
  };

  // Build hierarchical structure for display
  const buildHierarchy = (units) => {
    const rootUnits = units.filter(u => !u.parent_id);
    const childrenMap = {};
    
    units.forEach(unit => {
      if (unit.parent_id) {
        if (!childrenMap[unit.parent_id]) {
          childrenMap[unit.parent_id] = [];
        }
        childrenMap[unit.parent_id].push(unit);
      }
    });

    const renderUnit = (unit, level = 0) => {
      const children = childrenMap[unit.id] || [];
      return (
        <div key={unit.id} style={{ marginLeft: level * 30, marginBottom: 10 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            padding: 10,
            background: level === 0 ? '#e3f2fd' : '#f5f5f5',
            borderRadius: 6,
            border: '1px solid #ddd'
          }}>
            <div style={{ flex: 1 }}>
              <strong>{unit.name}</strong>
              {unit.description && (
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: 4 }}>
                  {unit.description}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="secondary-btn" 
                style={{ padding: '4px 12px', fontSize: '0.9rem' }}
                onClick={() => handleEdit(unit)}
              >
                Edit
              </button>
              <button 
                className="secondary-btn" 
                style={{ padding: '4px 12px', fontSize: '0.9rem', color: '#c0392b' }}
                onClick={() => handleDelete(unit.id)}
              >
                Delete
              </button>
            </div>
          </div>
          {children.map(child => renderUnit(child, level + 1))}
        </div>
      );
    };

    return rootUnits.map(unit => renderUnit(unit));
  };

  return (
    <AppLayout>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>Manage Organizational Chart</h2>
          <button 
            className="primary-btn" 
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ name: '', description: '', parent_id: '' });
            }}
          >
            Add Unit
          </button>
        </div>

        {showForm && (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            padding: 20, 
            borderRadius: 12, 
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{editingId ? 'Edit' : 'Add'} Organizational Unit</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label>
                Name:
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Chief of Medicine"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Clinical Director"
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </label>
              <label>
                Parent Unit (optional):
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                >
                  <option value="">None (Root Level)</option>
                  {orgUnits
                    .filter(u => !editingId || u.id !== parseInt(editingId))
                    .map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="primary-btn">Save</button>
                <button 
                  type="button" 
                  className="secondary-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', description: '', parent_id: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : orgUnits.length === 0 ? (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            padding: 40, 
            borderRadius: 12, 
            textAlign: 'center' 
          }}>
            <p>No organizational units found. Add a unit to get started.</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: 10 }}>
              Note: Organizational chart management endpoints may need to be implemented in the backend.
            </p>
          </div>
        ) : (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            padding: 20, 
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0 }}>Organizational Structure</h3>
            {buildHierarchy(orgUnits)}
          </div>
        )}

        {/* Table view for easier editing */}
        {orgUnits.length > 0 && (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            borderRadius: 12, 
            overflow: 'hidden',
            marginTop: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ padding: '12px 20px', margin: 0, background: '#f5f5f5' }}>All Units (Table View)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Parent</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgUnits.map(unit => (
                  <tr key={unit.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}>{unit.id}</td>
                    <td style={{ padding: 12 }}><strong>{unit.name}</strong></td>
                    <td style={{ padding: 12 }}>{unit.description || '—'}</td>
                    <td style={{ padding: 12 }}>{getParentName(unit.parent_id)}</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          className="secondary-btn" 
                          style={{ padding: '4px 12px', fontSize: '0.9rem' }}
                          onClick={() => handleEdit(unit)}
                        >
                          Edit
                        </button>
                        <button 
                          className="secondary-btn" 
                          style={{ padding: '4px 12px', fontSize: '0.9rem', color: '#c0392b' }}
                          onClick={() => handleDelete(unit.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

