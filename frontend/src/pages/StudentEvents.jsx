import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, registrationsAPI } from '../services/api';

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
    fetchRegisteredEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // For demo purposes, use mock data
      setEvents([
        {
          id: 1,
          title: "Tech Workshop",
          description: "Learn about modern web development technologies",
          type: "workshop",
          date: new Date().toISOString(),
          registrations_count: 15
        },
        {
          id: 2,
          title: "Career Guidance Seminar",
          description: "Get insights about career opportunities in tech",
          type: "seminar", 
          date: new Date().toISOString(),
          registrations_count: 8
        },
        {
          id: 3,
          title: "Coding Competition",
          description: "Test your programming skills in this exciting competition",
          type: "competition",
          date: new Date().toISOString(),
          registrations_count: 25
        }
      ]);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      // For demo purposes, start with no registrations
      setRegisteredEvents(new Set());
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      // For demo purposes, just add to local state
      setRegisteredEvents(prev => new Set([...prev, eventId]));
      alert('Successfully registered for the event!');
    } catch (err) {
      alert('Failed to register for the event');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <p className="mt-1 text-sm text-gray-500">
                Discover and register for events at your college
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="/student/my-events" className="btn-secondary">
                My Events
              </a>
              <a href="/student/feedback" className="btn-secondary">
                Submit Feedback
              </a>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events available</h3>
            <p className="text-gray-500">Check back later for new events at your college.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {event.type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👥</span>
                    {event.registrations_count || 0} registered
                  </div>
                </div>

                <div className="flex space-x-2">
                  {registeredEvents.has(event.id) ? (
                    <span className="flex-1 bg-green-100 text-green-800 text-center py-2 px-4 rounded-lg font-medium">
                      ✓ Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="flex-1 btn-primary"
                    >
                      Register
                    </button>
                  )}
                  <a
                    href={`/student/event/${event.id}`}
                    className="btn-secondary"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentEvents;
