import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import FeedPage from './features/posts/pages/FeedPage';
import SearchPage from './features/posts/pages/SearchPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import CandidaturesPage from './features/candidatures/pages/CandidaturesPage';
import AbonnementPage from './features/abonnements/pages/AbonnementPage';
import AdminAbonnementsPage from './features/abonnements/pages/AdminAbonnementsPage';
import './styles/globals.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Main App Routes */}
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/candidatures" element={<CandidaturesPage />} />
        <Route path="/abonnement" element={<AbonnementPage />} />
        <Route path="/admin/abonnements" element={<AdminAbonnementsPage />} />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
