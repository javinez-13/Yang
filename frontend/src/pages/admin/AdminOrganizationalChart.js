import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import { http } from '../../api/http.js';
import {
  FaUserMd,
  FaUserNurse,
  FaHospitalUser,
  FaSitemap,
  FaUserTie,
  FaBaby,
  FaHeartbeat
} from "react-icons/fa";
import "../OrganizationalChart.css";

// --- Reusable Node Component ---
const ChartNode = ({ title, icon: Icon, className = "", onEdit, onDelete }) => (
  <div className={`org-chart-node ${className}`} style={{ position: 'relative' }}>
    <Icon className="node-icon" />
    <span className="node-title">{title}</span>
    {(onEdit || onDelete) && (
      <div style={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        display: 'flex', 
        gap: 4,
        opacity: 0.8
      }}>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '4px 8px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            title="Edit"
          >
            ✏️
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '4px 8px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            title="Delete"
          >
            🗑️
          </button>
        )}
      </div>
    )}
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
      setOrgUnits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading org chart:', err);
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
      const payload = {
        name: formData.name,
        description: formData.description || null,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null
      };
      
      if (editingId) {
        await http.put(`/admin/org-chart/${editingId}`, payload);
      } else {
        await http.post('/admin/org-chart', payload);
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
    if (!confirm('Are you sure you want to delete this organizational unit? This action cannot be undone.')) return;
    try {
      await http.delete(`/admin/org-chart/${id}`);
      await loadData();
    } catch (err) {
      alert('Error deleting organizational unit: ' + (err.response?.data?.message || err.message));
    }
  };

  // Build hierarchical structure (same as user view)
  const buildHierarchy = () => {
    if (orgUnits.length === 0) {
      return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>No organizational chart data available. Add a unit to get started.</div>;
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
                  onEdit={() => handleEdit(unit)}
                  onDelete={() => handleDelete(unit.id)}
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
                  onEdit={() => handleEdit(unit)}
                  onDelete={() => handleDelete(unit.id)}
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

    // Find root unit
    const rootUnit = rootUnits.length > 0 ? rootUnits[0] : (orgUnits.length > 0 ? orgUnits[0] : null);
    
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
            onEdit={() => handleEdit(rootUnit)}
            onDelete={() => handleDelete(rootUnit.id)}
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

        <div style={{ 
          background: 'rgba(255,255,255,0.9)', 
          borderRadius: 12, 
          padding: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minHeight: '400px'
        }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading organizational chart...</div>
          ) : orgUnits.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
              <p>No organizational chart data available. Add a unit to get started.</p>
            </div>
          ) : (
            <div style={{ 
              background: '#f7f3f5',
              borderRadius: 30,
              padding: '4rem 2rem',
              boxShadow: '0 40px 70px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflowX: 'auto',
              minHeight: '300px'
            }}>
              <div style={{ overflowX: 'auto', paddingBottom: '1rem', width: '100%' }}>
                {buildHierarchy()}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
