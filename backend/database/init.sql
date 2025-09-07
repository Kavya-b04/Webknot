-- Campus Event Management Platform Database Schema
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS campus_events;
USE campus_events;

-- Colleges table
CREATE TABLE colleges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    college_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- Students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    college_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('workshop', 'fest', 'seminar', 'conference', 'competition', 'other') NOT NULL,
    date DATETIME NOT NULL,
    created_by INT NOT NULL,
    college_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- Registrations table
CREATE TABLE registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    student_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, student_id)
);

-- Attendance table
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('present', 'absent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (event_id, student_id)
);

-- Feedback table
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    student_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_feedback (event_id, student_id)
);

-- Insert sample colleges
INSERT INTO colleges (name, location) VALUES 
('Massachusetts Institute of Technology', 'Cambridge, MA'),
('Stanford University', 'Stanford, CA'),
('Harvard University', 'Cambridge, MA'),
('University of California, Berkeley', 'Berkeley, CA'),
('Carnegie Mellon University', 'Pittsburgh, PA');

-- Insert sample admin (password: admin123)
INSERT INTO admins (name, email, password, college_id) VALUES 
('Admin User', 'admin@mit.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Admin Stanford', 'admin@stanford.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2);

-- Insert sample students (password: student123)
INSERT INTO students (name, email, password, college_id) VALUES 
('John Doe', 'john@mit.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Jane Smith', 'jane@mit.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Alice Johnson', 'alice@stanford.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2),
('Bob Wilson', 'bob@stanford.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2);

-- Insert sample events
INSERT INTO events (title, description, type, date, created_by, college_id) VALUES 
('Web Development Workshop', 'Learn modern web development with React and Node.js', 'workshop', '2024-02-15 10:00:00', 1, 1),
('Tech Fest 2024', 'Annual technology festival with competitions and exhibitions', 'fest', '2024-03-20 09:00:00', 1, 1),
('AI and Machine Learning Seminar', 'Exploring the future of artificial intelligence', 'seminar', '2024-02-28 14:00:00', 1, 1),
('Startup Pitch Competition', 'Students pitch their innovative startup ideas', 'competition', '2024-04-10 16:00:00', 2, 2),
('Data Science Conference', 'Latest trends in data science and analytics', 'conference', '2024-03-15 09:00:00', 2, 2);

-- Insert sample registrations
INSERT INTO registrations (event_id, student_id) VALUES 
(1, 1), (1, 2), (2, 1), (2, 2), (3, 1), (4, 3), (4, 4), (5, 3), (5, 4);

-- Insert sample attendance
INSERT INTO attendance (event_id, student_id, status) VALUES 
(1, 1, 'present'), (1, 2, 'present'), (2, 1, 'present'), (2, 2, 'absent'), (3, 1, 'present');

-- Insert sample feedback
INSERT INTO feedback (event_id, student_id, rating, comments) VALUES 
(1, 1, 5, 'Excellent workshop! Learned a lot about React.'),
(1, 2, 4, 'Great content, but could use more hands-on practice.'),
(2, 1, 5, 'Amazing fest! Well organized and engaging.'),
(3, 1, 4, 'Very informative seminar on AI trends.');

-- Create indexes for better performance
CREATE INDEX idx_events_college_id ON events(college_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_student_id ON registrations(student_id);
CREATE INDEX idx_attendance_event_id ON attendance(event_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_feedback_event_id ON feedback(event_id);
CREATE INDEX idx_feedback_student_id ON feedback(student_id);

-- Show created tables
SHOW TABLES;
