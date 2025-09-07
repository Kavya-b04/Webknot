🎓 Campus Event Management Platform

This is my full-stack project built using the MERN stack with MySQL as the database. The idea is to have a platform where colleges can manage their campus events, and both admins and students get their own features.

What the Project Does
👩‍💼 Admin Side

Create, edit, and delete events for their college.

Manage event registrations and mark student attendance.

View reports on event popularity, student activity, and feedback.

🎓 Student Side

Browse upcoming events from their college.

Register for events with one click.

Give ratings (1–5 stars) and feedback after attending.

Check attendance history and participation.

⚙️ Tech Stack

Frontend: React.js + TailwindCSS (clean and responsive UI)

Backend: Node.js + Express.js

Database: MySQL (with relational schema for colleges, admins, students, events, etc.)

Authentication: JWT (tokens stored on client side)

Security: bcryptjs for password hashing, express-validator for inputs

🗂️ Database Design

I used MySQL because it is reliable for relational data.

Main tables include:

colleges → basic info about colleges

admins → college admins who create/manage events

students → registered students

events → event details (linked to colleges + admins)

registrations → who registered for which event

attendance → marking attendance as present/absent

feedback → ratings + comments by students

All the relationships are maintained using foreign keys.

project screenshots
admin dashboard
<img width="1920" height="1080" alt="admin dashboard" src="https://github.com/user-attachments/assets/49cb0e57-9b17-478b-8df6-c6603f836617" />

attendance management
<img width="1920" height="1080" alt="Screenshot (84)" src="https://github.com/user-attachments/assets/3dac6796-6150-42b6-b542-e367d37aa852" />

<img width="1920" height="1080" alt="Screenshot (85)" src="https://github.com/user-attachments/assets/94944dd5-11ef-4600-aef2-f35c9ddb9e20" />
<img width="1920" height="1080" alt="Screenshot (86)" src="https://github.com/user-attachments/assets/ae546412-4452-4ca1-ba5f-7fddfb22b117" />

<img width="1920" height="1080" alt="Screenshot (87)" src="https://github.com/user-attachments/assets/feb88b4d-7274-470c-af95-755f67111d96" />
<img width="1920" height="1080" alt="Screenshot (88)" src="https://github.com/user-attachments/assets/bd6856af-3731-4a37-af56-0a0c0fe526dc" />
<img width="1920" height="1080" alt="Screenshot (89)" src="https://github.com/user-attachments/assets/182d1fe8-650b-4350-9cb1-18da24bf3bf7" />
<img width="1920" height="1080" alt="Screenshot (81)" src="https://github.com/user-attachments/assets/7dfd42b9-19d7-4828-b47b-02a29784bb60" />
<img width="1920" height="1080" alt="Screenshot (83)" src="https://github.com/user-attachments/assets/dac8dc69-fef2-455a-90e2-ca187a7d856f" />


WITH AI CONVERSATION **************PROMPT TO CURSOR
i used chat gpt for how to prompt in curosr ...it gave prompt to paste in curosr
chatgpt prompt
You are an expert MERN stack backend developer.  
Build the backend for a **Campus Event Management Platform** using **Node.js, Express, and MySQL**.

### Requirements:
- Admin portal:
  - Admin can create, update, delete events.
  - Admin can mark attendance for students in an event.
- Student app:
  - Students can browse events (only their college).
  - Students can register for events.
  - Students can submit feedback (rating 1–5).

### Database schema (MySQL):
- `colleges`: id, name, location
- `admins`: id, name, email, password (hashed), college_id
- `students`: id, name, email, password (hashed), college_id
- `events`: id, title, description, type (workshop/fest/seminar/etc), date, created_by (admin_id), college_id
- `registrations`: id, event_id, student_id
- `attendance`: id, event_id, student_id, status (present/absent)
- `feedback`: id, event_id, student_id, rating (1–5), comments

### API Endpoints:
#### Auth
- `POST /api/auth/admin/signup`
- `POST /api/auth/admin/login`
- `POST /api/auth/student/signup`
- `POST /api/auth/student/login`

#### Events
- `POST /api/events` (admin only, create event)
- `GET /api/events/:collegeId` (students fetch events for their college)
- `PUT /api/events/:id` (admin update event)
- `DELETE /api/events/:id` (admin delete event)

#### Registration
- `POST /api/registrations/:eventId` (student register)

#### Attendance
- `POST /api/attendance/:eventId/:studentId` (admin mark attendance)

#### Feedback
- `POST /api/feedback/:eventId` (student submit rating + comments)

#### Reports
- `GET /api/reports/popularity` → total registrations per event
- `GET /api/reports/attendance/:eventId` → attendance % for that event
- `GET /api/reports/feedback/:eventId` → average feedback score
- `GET /api/reports/student/:studentId` → how many events a student attended
- `GET /api/reports/top-students` → top 3 most active students

### Extra:
- Use **JWT authentication** for admins & students.
- Store secrets in `.env` file (e.g., DB connection, JWT secret).
- Organize code with MVC pattern:
  - `models/`
  - `controllers/`
  - `routes/`
  - `config/db.js`

### Deliverables:
- Full backend project structure
- Connection to MySQL
- Sample `.env.example` file
- Instructions in `README.md` for setup and running

You are an expert React + TailwindCSS frontend developer.  
Build the frontend for a **Campus Event Management Platform**.  

### Requirements:
There are two roles: **Admin Portal (Web)** and **Student App (Web/Mobile-friendly)**.

---

### Tech Stack:
- React (Vite)
- TailwindCSS (already installed with PostCSS + Autoprefixer)
- React Router DOM for navigation
- Axios for API calls to backend (Express + MySQL)
- Component structure should be clean and reusable

---

### Pages & Features:

#### 🔑 Authentication
- **Login / Signup for Students**
- **Login / Signup for Admins**
- Save JWT token in `localStorage` and use it for protected routes

---

#### 🎓 Student App (Web/Mobile UI)
- **Browse Events Page** → List events from their college  
  (API: `GET /api/events/:collegeId`)
- **Register for Event Button** → Calls  
  (API: `POST /api/registrations/:eventId`)
- **My Events Page** → Shows events student registered for
- **Submit Feedback Page** → Rate event 1–5 + optional comments  
  (API: `POST /api/feedback/:eventId`)

---

#### 🛠️ Admin Portal (Web UI)
- **Dashboard** → Show list of all events created by the admin
- **Create Event Form** → title, description, type, date  
  (API: `POST /api/events`)
- **Edit/Delete Event** → update or remove event  
  (API: `PUT /api/events/:id`, `DELETE /api/events/:id`)
- **Attendance Page** → Mark attendance for students in event  
  (API: `POST /api/attendance/:eventId/:studentId`)
- **Reports Page**:
  - Event Popularity Report → Sorted by registrations  
    (API: `GET /api/reports/popularity`)
  - Attendance % for each event  
    (API: `GET /api/reports/attendance/:eventId`)
  - Average feedback score per event  
    (API: `GET /api/reports/feedback/:eventId`)
  - Student participation report  
    (API: `GET /api/reports/student/:studentId`)
  - Top 3 most active students  
    (API: `GET /api/reports/top-students`)

---

### UI/UX Notes:
- Use TailwindCSS for styling
- Responsive design → student UI should be mobile-friendly
- Admin portal can be desktop-first
- Use simple cards, tables, and modals

---

### Deliverables:
- React project with `src/components`, `src/pages`
- Routing for Admin vs Student (separate dashboards)
- Axios setup for backend API calls
- Tailwind styling applied
- Sample `.env.example` file for frontend (API base URL)
- Instructions in `README.md` on how to run the frontend

i used cursor for both backend and frontend code


