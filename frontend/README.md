# Campus Event Management Platform - Frontend

A modern React frontend for the Campus Event Management Platform with separate interfaces for students and administrators.

## Features

### 🎓 Student Portal
- **Browse Events**: View and register for events at their college
- **My Events**: Track registered events and manage registrations
- **Submit Feedback**: Rate and review attended events
- **Mobile-friendly**: Responsive design optimized for mobile devices

### 🛠️ Admin Portal
- **Dashboard**: Overview of events, registrations, and statistics
- **Create Events**: Add new events with details and scheduling
- **Manage Events**: Edit and delete existing events
- **Reports**: Analytics on event popularity, student participation, and attendance
- **Attendance**: Mark student attendance for events

## Tech Stack

- **React 18** with Vite for fast development
- **TailwindCSS** for modern, responsive styling
- **React Router DOM** for client-side routing
- **Axios** for API communication
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your API URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoginForm.jsx   # Authentication forms
│   └── SignupForm.jsx
├── pages/              # Page components
│   ├── StudentEvents.jsx      # Student portal pages
│   ├── StudentMyEvents.jsx
│   ├── StudentFeedback.jsx
│   ├── AdminDashboard.jsx     # Admin portal pages
│   ├── AdminCreateEvent.jsx
│   └── AdminReports.jsx
├── contexts/           # React Context providers
│   └── AuthContext.jsx # Authentication state management
├── services/           # API service layer
│   └── api.js         # Axios configuration and API calls
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── App.jsx            # Main application component
```

## API Integration

The frontend communicates with the backend through the following API endpoints:

### Authentication
- `POST /api/auth/admin/signup` - Admin registration
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/student/signup` - Student registration
- `POST /api/auth/student/login` - Student login

### Events
- `GET /api/events/:collegeId` - Get events by college
- `GET /api/events` - Get all events (admin)
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Registrations
- `POST /api/registrations/:eventId` - Register for event
- `GET /api/registrations/student` - Get student registrations
- `DELETE /api/registrations/:eventId` - Cancel registration

### Feedback
- `POST /api/feedback/:eventId` - Submit feedback
- `GET /api/feedback/student` - Get student feedback

### Reports
- `GET /api/reports/popularity` - Event popularity report
- `GET /api/reports/top-students` - Top students report
- `GET /api/reports/dashboard` - Dashboard statistics

## Authentication

The application uses JWT tokens for authentication:

1. **Login/Signup**: Users authenticate and receive a JWT token
2. **Token Storage**: Tokens are stored in localStorage
3. **Protected Routes**: Routes are protected based on user role (admin/student)
4. **Auto-logout**: Users are automatically logged out on token expiration

## Styling

The application uses TailwindCSS with custom components:

- **Primary Colors**: Blue theme for buttons and links
- **Responsive Design**: Mobile-first approach
- **Component Classes**: Reusable utility classes for buttons, cards, and forms
- **Dark Mode**: Ready for dark mode implementation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use TailwindCSS for styling
- Implement proper error handling
- Add loading states for better UX

## Deployment

### Build for Production

```bash
npm run build
```

The build files will be in the `dist/` directory.

### Environment Variables

Make sure to set the correct API URL in your production environment:

```bash
VITE_API_URL=https://your-api-domain.com/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.