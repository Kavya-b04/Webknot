import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registrationsAPI, feedbackAPI } from '../services/api';

const StudentFeedback = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comments: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
          attendance_status: "present",
          feedback_submitted: false
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
          attendance_status: "present",
          feedback_submitted: true
        }
      ]);
    } catch (err) {
      setError('Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // For demo purposes, just update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg.event_id === selectedEvent.id 
            ? { ...reg, feedback_submitted: true }
            : reg
        )
      );
      setSuccess('Feedback submitted successfully!');
      setFeedback({ rating: 5, comments: '' });
      setSelectedEvent(null);
    } catch (err) {
      setError('Failed to submit feedback');
    } finally {
      setSubmitting(false);
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
              <h1 className="text-3xl font-bold text-gray-900">Submit Feedback</h1>
              <p className="mt-1 text-sm text-gray-500">
                Rate and review events you've attended
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="/student/events" className="btn-secondary">
                Browse Events
              </a>
              <a href="/student/my-events" className="btn-secondary">
                My Events
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

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {!selectedEvent ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select an event to provide feedback:</h2>
            
            {registrations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events to review</h3>
                <p className="text-gray-500 mb-4">You need to register for events first before you can provide feedback.</p>
                <a href="/student/events" className="btn-primary">
                  Browse Events
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registrations.map((registration) => (
                  <div key={registration.id} className="card hover:shadow-lg transition-shadow cursor-pointer"
                       onClick={() => setSelectedEvent(registration.event)}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {registration.event?.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {registration.event?.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">📅</span>
                        {formatDate(registration.event?.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">🏷️</span>
                        {registration.event?.type}
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        Click to provide feedback
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <div className="mb-6">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-primary-600 hover:text-primary-700 font-medium mb-4"
                >
                  ← Back to events
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedEvent.title}
                </h2>
                <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📅</span>
                  {formatDate(selectedEvent.date)}
                </div>
              </div>

              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (1-5 stars)
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback({ ...feedback, rating: star })}
                        className={`text-2xl ${
                          star <= feedback.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {feedback.rating === 1 && 'Poor'}
                    {feedback.rating === 2 && 'Fair'}
                    {feedback.rating === 3 && 'Good'}
                    {feedback.rating === 4 && 'Very Good'}
                    {feedback.rating === 5 && 'Excellent'}
                  </p>
                </div>

                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                    Comments (Optional)
                  </label>
                  <textarea
                    id="comments"
                    rows={4}
                    className="input-field"
                    placeholder="Share your thoughts about the event..."
                    value={feedback.comments}
                    onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1"
                  >
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentFeedback;
