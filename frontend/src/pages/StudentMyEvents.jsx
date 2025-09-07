import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registrationsAPI } from '../services/api';

const StudentMyEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      // For demo purposes, use mock data
      setRegistrations([
        {
          id: 1,
          event_id: 1,
          event_title: "Tech Workshop",
          event_description: "Learn about modern web development technologies",
          event_type: "workshop",
          event_date: new Date().toISOString(),
          registration_date: new Date().toISOString(),
          status: "confirmed",
          attendance_status: "present"
        },
        {
          id: 2,
          event_id: 2,
          event_title: "Career Guidance Seminar",
          event_description: "Get insights about career opportunities in tech",
          event_type: "seminar",
          event_date: new Date().toISOString(),
          registration_date: new Date().toISOString(),
          status: "confirmed",
          attendance_status: "pending"
        }
      ]);
    } catch (err) {
      setError('Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      try {
        // For demo purposes, just remove from local state
        setRegistrations(prev => prev.filter(reg => reg.event_id !== eventId));
        alert('Registration cancelled successfully');
      } catch (err) {
        alert('Failed to cancel registration');
      }
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
          <p className="mt-4 text-gray-600">Loading your events...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
              <p className="mt-1 text-sm text-gray-500">
                Events you've registered for
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="/student/events" className="btn-secondary">
                Browse Events
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

        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events registered</h3>
            <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
            <a href="/student/events" className="btn-primary">
              Browse Events
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((registration) => (
              <div key={registration.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {registration.event?.title}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Registered
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {registration.event?.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    {formatDate(registration.event?.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🏷️</span>
                    {registration.event?.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    Registered: {formatDate(registration.created_at)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCancelRegistration(registration.event_id)}
                    className="flex-1 bg-red-100 text-red-800 hover:bg-red-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Cancel Registration
                  </button>
                  <a
                    href={`/student/feedback/${registration.event_id}`}
                    className="btn-primary"
                  >
                    Give Feedback
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

export default StudentMyEvents;
