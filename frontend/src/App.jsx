import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

// Student Pages
import StudentEvents from './pages/StudentEvents';
import StudentMyEvents from './pages/StudentMyEvents';
import StudentFeedback from './pages/StudentFeedback';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';
import AdminRegistrations from './pages/AdminRegistrations';
import AdminCreateEvent from './pages/AdminCreateEvent';
import AdminReports from './pages/AdminReports';
import AdminAttendance from './pages/AdminAttendance';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/student/events" replace />;
  }

  if (!requireAdmin && user.role !== 'student') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/events" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignupForm />
                </PublicRoute>
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/student/events" 
              element={
                <ProtectedRoute>
                  <StudentEvents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/my-events" 
              element={
                <ProtectedRoute>
                  <StudentMyEvents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/feedback" 
              element={
                <ProtectedRoute>
                  <StudentFeedback />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminEvents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/registrations" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminRegistrations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events/create" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCreateEvent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/attendance" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminAttendance />
                </ProtectedRoute>
              } 
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;