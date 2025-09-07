import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reportsAPI } from '../services/api';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('popularity');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchReportData(activeTab);
  }, [activeTab]);

  const fetchReportData = async (tab) => {
    setLoading(true);
    setError('');

    try {
      // For demo purposes, use mock data
      switch (tab) {
        case 'popularity':
          setData({
            events: [
              { id: 1, title: "Tech Workshop", registrations: 25, attendance: 20 },
              { id: 2, title: "Career Guidance Seminar", registrations: 18, attendance: 15 },
              { id: 3, title: "Coding Competition", registrations: 32, attendance: 28 },
              { id: 4, title: "AI & Machine Learning Talk", registrations: 15, attendance: 12 }
            ]
          });
          break;
        case 'top-students':
          setData({
            students: [
              { id: 1, name: "John Doe", email: "john@example.com", events_attended: 8, total_events: 10 },
              { id: 2, name: "Jane Smith", email: "jane@example.com", events_attended: 6, total_events: 8 },
              { id: 3, name: "Mike Johnson", email: "mike@example.com", events_attended: 5, total_events: 7 },
              { id: 4, name: "Sarah Wilson", email: "sarah@example.com", events_attended: 4, total_events: 5 }
            ]
          });
          break;
        case 'dashboard':
          setData({
            total_events: 12,
            total_registrations: 150,
            total_students: 45,
            average_attendance: 78.5,
            popular_event_types: [
              { type: "workshop", count: 5 },
              { type: "seminar", count: 4 },
              { type: "competition", count: 2 },
              { type: "talk", count: 1 }
            ]
          });
          break;
        default:
          return;
      }
    } catch (err) {
      setError('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'popularity', name: 'Event Popularity', icon: '📊' },
    { id: 'top-students', name: 'Top Students', icon: '🏆' },
    { id: 'dashboard', name: 'Dashboard Stats', icon: '📈' }
  ];

  const renderPopularityReport = () => {
    if (!data.events) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Events by Registration Count</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.events.map((event, index) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📅'}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {event.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.registrations_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTopStudentsReport = () => {
    if (!data.students) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Most Active Students</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.students.map((student, index) => (
            <div key={student.id} className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤'}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{student.name}</h4>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Events Registered:</span>
                  <span className="text-sm font-medium text-gray-900">{student.events_registered || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Events Attended:</span>
                  <span className="text-sm font-medium text-gray-900">{student.events_attended || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Feedback Given:</span>
                  <span className="text-sm font-medium text-gray-900">{student.feedback_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboardStats = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Dashboard Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {data.total_events || 0}
            </div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {data.total_registrations || 0}
            </div>
            <div className="text-sm text-gray-600">Total Registrations</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {data.average_rating ? data.average_rating.toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {data.attendance_rate ? `${data.attendance_rate}%` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="mt-1 text-sm text-gray-500">
                Analytics and insights for your events
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="/admin/dashboard" className="btn-secondary">
                Dashboard
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
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading report...</span>
          </div>
        ) : (
          <div className="card">
            {activeTab === 'popularity' && renderPopularityReport()}
            {activeTab === 'top-students' && renderTopStudentsReport()}
            {activeTab === 'dashboard' && renderDashboardStats()}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReports;
