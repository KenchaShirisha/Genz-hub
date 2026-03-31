import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import Loader from './components/Common/Loader';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CodingModule from './components/Coding/CodingModule';
import InterviewModule from './components/Interview/InterviewModule';
import MockInterview from './components/Interview/MockInterview';
import QuizModule from './components/Quiz/QuizModule';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Profile from './pages/Profile';
import Notes from './pages/Notes';
import Home from './pages/Home';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return !user ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/coding" element={<PrivateRoute><CodingModule /></PrivateRoute>} />
        <Route path="/interview" element={<PrivateRoute><InterviewModule /></PrivateRoute>} />
        <Route path="/mock-interview" element={<PrivateRoute><MockInterview /></PrivateRoute>} />
        <Route path="/quiz" element={<PrivateRoute><QuizModule /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
