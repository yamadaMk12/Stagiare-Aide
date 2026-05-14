import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
<<<<<<< feature/feed-posts
=======
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
>>>>>>> main
import FeedPage from './features/posts/pages/FeedPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import './styles/globals.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< feature/feed-posts
        <Route path="/feed" element={<FeedPage />} />
        {/* Redirect root to feed for now */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
=======
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Main App Routes */}
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
>>>>>>> main
      </Routes>
    </BrowserRouter>
  );
};

export default App;
