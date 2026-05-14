import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import FeedPage from './features/posts/pages/FeedPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import './styles/globals.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Main App Routes */}
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
