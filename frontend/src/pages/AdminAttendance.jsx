import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, attendanceAPI } from '../services/api';

const AdminAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
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

  const fetchEventRegistrations = async (eventId) => {
    try {
      // For demo purposes, use mock data
      setRegistrations([
        {
          id: 1,
          student_id: 1,
          student_name: "John Doe",
          student_email: "john@example.com",
          registration_date: new Date().toISOString(),
          attendance_status: "present"
        },
        {
          id: 2,
          student_id: 2,
          student_name: "Jane Smith",
          student_email: "jane@example.com",
          registration_date: new Date().toISOString(),
          attendance_status: "absent"
        },
        {
          id: 3,
          student_id: 3,
          student_name: "Mike Johnson",
          student_email: "mike@example.com",
          registration_date: new Date().toISOString(),
          attendance_status: "pending"
        }
      ]);
    } catch (err) {
      setError('Failed to fetch registrations');
    }
  };

  const handleMarkAttendance = async (eventId, studentId, status) => {
    try {
      // For demo purposes, update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg.student_id === studentId 
            ? { ...reg, attendance_status: status }
            : reg
        )
      );
      alert('Attendance marked successfully');
    } catch (err) {
      alert('Failed to mark attendance');
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
              <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Mark attendance for event participants
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="/admin/dashboard" className="btn-secondary">
                Dashboard
              </a>
              <a href="/admin/reports" className="btn-secondary">
                Reports
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

        {!selectedEvent ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select an event to manage attendance:</h2>
            
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events available</h3>
                <p className="text-gray-500">Create events first to manage attendance.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="card hover:shadow-lg transition-shadow cursor-pointer"
                       onClick={() => {
                         setSelectedEvent(event);
                         fetchEventRegistrations(event.id);
                       }}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">📅</span>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">👥</span>
                        {event.registrations_count || 0} registered
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        Click to manage attendance
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
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

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Students</h3>
              
              {registrations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">👥</div>
                  <p className="text-gray-500">No students registered for this event.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {registration.student?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {registration.student?.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(registration.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                              registration.attendance?.status === 'present' 
                                ? 'bg-green-100 text-green-800'
                                : registration.attendance?.status === 'absent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {registration.attendance?.status || 'Not marked'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleMarkAttendance(selectedEvent.id, registration.student_id, 'present')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(selectedEvent.id, registration.student_id, 'absent')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Absent
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminAttendance;
