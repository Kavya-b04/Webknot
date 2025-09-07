# Campus Event Management Platform - Backend

A comprehensive MERN stack backend for managing campus events, built with Node.js, Express, and MySQL.

## Features

### Admin Portal
- Create, update, and delete events
- Mark attendance for students
- View comprehensive reports and analytics
- Manage event registrations

### Student App
- Browse events from their college
- Register for events
- Submit feedback and ratings (1-5 stars)
- View attendance history

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Database Schema

### Tables
- `colleges`: College information (id, name, location)
- `admins`: Admin users (id, name, email, password, college_id)
- `students`: Student users (id, name, email, password, college_id)
- `events`: Event details (id, title, description, type, date, created_by, college_id)
- `registrations`: Event registrations (id, event_id, student_id)
- `attendance`: Attendance records (id, event_id, student_id, status)
- `feedback`: Student feedback (id, event_id, student_id, rating, comments)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone and Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campus_events
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

### 3. Database Setup
Create the MySQL database and tables:

```sql
CREATE DATABASE campus_events;

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

-- Insert sample data
INSERT INTO colleges (name, location) VALUES 
('MIT', 'Cambridge, MA'),
('Stanford University', 'Stanford, CA'),
('Harvard University', 'Cambridge, MA');

INSERT INTO admins (name, email, password, college_id) VALUES 
('Admin User', 'admin@mit.edu', '$2a$10$example_hash', 1);

INSERT INTO students (name, email, password, college_id) VALUES 
('John Doe', 'john@mit.edu', '$2a$10$example_hash', 1),
('Jane Smith', 'jane@mit.edu', '$2a$10$example_hash', 1);
```

### 4. Run the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/admin/signup` - Admin registration
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/student/signup` - Student registration
- `POST /api/auth/student/login` - Student login

### Events
- `POST /api/events` - Create event (Admin only)
- `GET /api/events/:collegeId` - Get events by college (Students)
- `GET /api/events` - Get all events (Admin only)
- `GET /api/events/single/:id` - Get single event
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)
- `GET /api/events/stats/:id` - Get event statistics

### Registrations
- `POST /api/registrations/:eventId` - Register for event (Student)
- `GET /api/registrations/student` - Get student registrations
- `GET /api/registrations/event/:eventId` - Get event registrations (Admin)
- `DELETE /api/registrations/:eventId` - Cancel registration (Student)

### Attendance
- `POST /api/attendance/:eventId/:studentId` - Mark attendance (Admin)
- `GET /api/attendance/event/:eventId` - Get event attendance (Admin)
- `GET /api/attendance/student` - Get student attendance
- `GET /api/attendance/stats/:eventId` - Get attendance statistics

### Feedback
- `POST /api/feedback/:eventId` - Submit feedback (Student)
- `GET /api/feedback/student` - Get student feedback
- `GET /api/feedback/event/:eventId` - Get event feedback (Admin)
- `GET /api/feedback/stats/:eventId` - Get feedback statistics

### Reports
- `GET /api/reports/popularity` - Event popularity report (Admin)
- `GET /api/reports/attendance/:eventId` - Event attendance report (Admin)
- `GET /api/reports/feedback/:eventId` - Event feedback report (Admin)
- `GET /api/reports/student/:studentId` - Student activity report (Admin)
- `GET /api/reports/top-students` - Top active students (Admin)
- `GET /api/reports/dashboard` - Dashboard overview (Admin)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Sample API Usage

### 1. Admin Signup
```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@college.edu",
    "password": "password123",
    "college_id": 1
  }'
```

### 2. Student Login
```bash
curl -X POST http://localhost:5000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "password123"
  }'
```

### 3. Create Event (Admin)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "title": "Tech Workshop",
    "description": "Learn about modern web development",
    "type": "workshop",
    "date": "2024-01-15T10:00:00Z",
    "college_id": 1
  }'
```

### 4. Register for Event (Student)
```bash
curl -X POST http://localhost:5000/api/registrations/1 \
  -H "Authorization: Bearer <student_token>"
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── eventController.js  # Event management
│   ├── registrationController.js
│   ├── attendanceController.js
│   ├── feedbackController.js
│   └── reportController.js
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── College.js         # College model
│   ├── Admin.js           # Admin model
│   ├── Student.js         # Student model
│   ├── Event.js           # Event model
│   ├── Registration.js    # Registration model
│   ├── Attendance.js      # Attendance model
│   └── Feedback.js        # Feedback model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── events.js          # Event routes
│   ├── registrations.js   # Registration routes
│   ├── attendance.js      # Attendance routes
│   ├── feedback.js        # Feedback routes
│   └── reports.js         # Report routes
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── server.js              # Main server file
└── README.md              # This file
```

## Error Handling

The API returns consistent error responses:
```json
{
  "message": "Error description",
  "errors": [] // Validation errors (if any)
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for automatic server restarts on file changes.

### Environment Variables
- `DB_HOST`: MySQL host (default: localhost)
- `DB_USER`: MySQL username (default: root)
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name (default: campus_events)
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
