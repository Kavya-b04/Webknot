import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      // For demo purposes, use mock data
      setRegistrations([
        {
          id: 1,
          event_id: 1,
          event_title: "Tech Workshop",
          student_id: 1,
          student_name: "John Doe",
          student_email: "john@example.com",
          registration_date: new Date().toISOString(),
          status: "confirmed"
        },
        {
          id: 2,
          event_id: 1,
          event_title: "Tech Workshop",
          student_id: 2,
          student_name: "Jane Smith",
          student_email: "jane@example.com",
          registration_date: new Date().toISOString(),
          status: "confirmed"
        },
        {
          id: 3,
          event_id: 2,
          event_title: "Career Guidance Seminar",
          student_id: 3,
          student_name: "Mike Johnson",
          student_email: "mike@example.com",
          registration_date: new Date().toISOString(),
          status: "pending"
        },
        {
          id: 4,
          event_id: 3,
          event_title: "Coding Competition",
          student_id: 4,
          student_name: "Sarah Wilson",
          student_email: "sarah@example.com",
          registration_date: new Date().toISOString(),
          status: "confirmed"
        },
        {
          id: 5,
          event_id: 3,
          event_title: "Coding Competition",
          student_id: 5,
          student_name: "David Brown",
          student_email: "david@example.com",
          registration_date: new Date().toISOString(),
          status: "cancelled"
        }
      ]);
    } catch (err) {
      setError('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (registrationId, newStatus) => {
    try {
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: newStatus }
            : reg
        )
      );
      alert('Registration status updated successfully');
    } catch (err) {
      alert('Failed to update registration status');
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        setRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
        alert('Registration deleted successfully');
      } catch (err) {
        alert('Failed to delete registration');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesFilter = filter === 'all' || reg.status === filter;
    const matchesSearch = 
      reg.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.event_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading registrations...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          Event Registrations
        </h1>
        
        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search by student name, email, or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              minWidth: '150px'
            }}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
              {registrations.length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Registrations</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
              {registrations.filter(r => r.status === 'confirmed').length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Confirmed</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
              {registrations.filter(r => r.status === 'pending').length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Pending</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
              {registrations.filter(r => r.status === 'cancelled').length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Cancelled</div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      {/* Registrations Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Student
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Event
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Registration Date
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Status
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#111827' }}>{registration.student_name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{registration.student_email}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500', color: '#111827' }}>{registration.event_title}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {formatDate(registration.registration_date)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      ...getStatusColor(registration.status)
                    }}>
                      {registration.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {registration.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(registration.id, 'confirmed')}
                          style={{
                            backgroundColor: '#d1fae5',
                            color: '#059669',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Confirm
                        </button>
                      )}
                      {registration.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(registration.id, 'cancelled')}
                          style={{
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteRegistration(registration.id)}
                        style={{
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
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
      </div>

      {filteredRegistrations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No registrations found</div>
          <div style={{ fontSize: '0.875rem' }}>Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;
