# Deployment Guide

## Quick Start

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Access the Application**
   - Open `http://localhost:5173` in your browser
   - You'll see the login page
   - Create accounts for both students and admins to test the platform

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the `backend` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=campus_events
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend Environment Variables
The frontend is already configured to connect to `http://localhost:5000/api` by default.

## Testing the Application

### 1. Create Admin Account
- Go to `/signup`
- Select "Admin" as user type
- Fill in the form with:
  - Name: Admin User
  - Email: admin@college.edu
  - College ID: 1
  - Password: password123

### 2. Create Student Account
- Go to `/signup`
- Select "Student" as user type
- Fill in the form with:
  - Name: Student User
  - Email: student@college.edu
  - College ID: 1
  - Password: password123

### 3. Test Admin Features
- Login as admin
- Create events
- View dashboard
- Check reports
- Manage attendance

### 4. Test Student Features
- Login as student
- Browse events
- Register for events
- Submit feedback
- View registered events

## Production Deployment

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Production
```bash
cd backend
NODE_ENV=production npm start
```

## API Endpoints

The frontend communicates with these backend endpoints:

- **Authentication**: `/api/auth/*`
- **Events**: `/api/events/*`
- **Registrations**: `/api/registrations/*`
- **Feedback**: `/api/feedback/*`
- **Reports**: `/api/reports/*`
- **Attendance**: `/api/attendance/*`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend is running and CORS is enabled
2. **API Connection**: Check that `VITE_API_URL` points to the correct backend URL
3. **Authentication**: Clear localStorage if you encounter auth issues
4. **Database**: Ensure MySQL is running and the database is properly configured

### Development Tips

- Use browser dev tools to monitor API calls
- Check the Network tab for failed requests
- Use React DevTools for component debugging
- Check the Console for JavaScript errors
