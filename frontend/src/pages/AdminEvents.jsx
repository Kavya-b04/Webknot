import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events from API...');
      const response = await eventsAPI.getAllEvents();
      console.log('Events fetched successfully:', response.data);
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        console.log('Deleting event:', eventId);
        await eventsAPI.deleteEvent(eventId);
        setEvents(prev => prev.filter(event => event.id !== eventId));
        alert('Event deleted successfully');
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (eventId) => {
    try {
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, status: event.status === 'active' ? 'completed' : 'active' }
            : event
        )
      );
      alert('Event status updated successfully');
    } catch (err) {
      alert('Failed to update event status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'workshop': return 'text-purple-600 bg-purple-100';
      case 'seminar': return 'text-blue-600 bg-blue-100';
      case 'competition': return 'text-orange-600 bg-orange-100';
      case 'talk': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading events...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Event Management</h1>
        <Link 
          to="/admin/events/create"
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Create New Event
        </Link>
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

      {/* Filter Tabs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
          {['all', 'active', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: filter === status ? '#2563eb' : 'transparent',
                color: filter === status ? 'white' : '#6b7280',
                fontWeight: '500',
                textTransform: 'capitalize',
                cursor: 'pointer',
                borderBottom: filter === status ? '2px solid #2563eb' : '2px solid transparent'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {filteredEvents.map((event) => (
          <div key={event.id} style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                {event.title}
              </h3>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                ...getStatusColor(event.status)
              }}>
                {event.status}
              </span>
            </div>

            <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>
              {event.description}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                ...getTypeColor(event.type)
              }}>
                {event.type}
              </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Date & Time:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{formatDate(event.date)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Registrations:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{event.registrations_count}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link
                to={`/admin/events/${event.id}/edit`}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Edit
              </Link>
              <Link
                to={`/admin/events/${event.id}/registrations`}
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                View Registrations
              </Link>
              <button
                onClick={() => handleToggleStatus(event.id)}
                style={{
                  backgroundColor: event.status === 'active' ? '#fef3c7' : '#d1fae5',
                  color: event.status === 'active' ? '#d97706' : '#059669',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {event.status === 'active' ? 'Mark Complete' : 'Reactivate'}
              </button>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                style={{
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No events found</div>
          <div style={{ fontSize: '0.875rem' }}>Create your first event to get started</div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
