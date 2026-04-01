
# ⚡ GenZ Productivity, Coding & Interview Preparation Hub

A full-stack MERN application for placement preparation with 165+ interview questions, coding practice, mock interviews, quizzes, and leaderboard.

---

## 🗂 Project Structure

```
code1111/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → Route logic
│   ├── data/           → Seed data + seeder script
│   ├── middleware/     → Auth + error handlers
│   ├── models/         → Mongoose schemas
│   ├── routes/         → Express routes
│   ├── uploads/        → Avatar images
│   ├── .env            → Environment variables
│   ├── server.js       → Entry point
│   └── package.json
└── frontend/
    ├── public/
    └── src/
        ├── components/ → Auth, Dashboard, Coding, Interview, Quiz, Leaderboard
        ├── context/    → AuthContext, ThemeContext
        ├── pages/      → Home, Profile, Notes
        ├── styles/     → global.css
        └── utils/      → api.js, helpers.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/genz-hub
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

Seed the database (165+ interview questions + coding problems):
```bash
npm run seed
```

Start backend:
```bash
npm run dev
```

Backend runs on: http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/auth/me | Get current user | Yes |
| GET | /api/user/profile | Get profile | Yes |
| PUT | /api/user/update | Update name | Yes |
| POST | /api/user/avatar | Upload avatar | Yes |
| POST | /api/user/notes | Add note | Yes |
| DELETE | /api/user/notes/:id | Delete note | Yes |
| GET | /api/problems | Get coding problems | Yes |
| GET | /api/problems/:id | Get single problem | Yes |
| POST | /api/problems/:id/submit | Submit solution | Yes |
| GET | /api/interview | Get all questions | Yes |
| GET | /api/interview/:category | Get by category | Yes |
| GET | /api/interview/random | Random question | Yes |
| POST | /api/interview/bookmark | Bookmark question | Yes |
| POST | /api/interview/complete | Mark complete | Yes |
| GET | /api/quiz | Get quiz questions | Yes |
| POST | /api/quiz/submit | Submit quiz | Yes |
| GET | /api/leaderboard | Get leaderboard | Yes |

---

## 🎯 Features

- ✅ JWT Authentication (Register/Login/Logout)
- ✅ Dark/Light theme toggle
- ✅ Dashboard with progress tracking
- ✅ Coding practice (Java, Python, JS, C++, SQL)
- ✅ 165+ Interview questions (10 categories)
- ✅ Mock interview with 45s timer
- ✅ MCQ Quiz with scoring
- ✅ Leaderboard with rankings
- ✅ Bookmark questions
- ✅ Notes system
- ✅ Profile with avatar upload
- ✅ Real-time updates (Socket.io)
- ✅ Search & filter
- ✅ Mobile responsive

---

## 🌐 Deployment

### Backend (Railway / Render)
1. Push to GitHub
2. Connect repo to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel / Netlify)
1. Push frontend to GitHub
2. Connect to Vercel
3. Set `REACT_APP_API_URL` if needed
4. Deploy

### MongoDB Atlas (Production DB)
1. Create cluster at mongodb.com/atlas
2. Get connection string
3. Replace MONGO_URI in .env

---

## 🔐 Security Features
- bcrypt password hashing (salt rounds: 10)
- JWT token authentication
- Input validation (express-validator)
- CORS protection
- Error handling middleware
- File upload validation (images only, 2MB limit)

---

## 📊 Database Schema

**User**: name, email, password, avatar, progress{coding, quiz, interview}, bookmarks, notes, solvedProblems

**InterviewQuestion**: category, question, answer, difficulty, tags

**CodingProblem**: title, description, category, difficulty, supportedLanguages, starterCode, examples, constraints, points

**Quiz**: category, question, options[], correctAnswer, explanation, difficulty
=======
# Genz-hub
