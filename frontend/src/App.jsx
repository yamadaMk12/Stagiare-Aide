import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FeedPage from './features/posts/pages/FeedPage';
import './styles/globals.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/feed" element={<FeedPage />} />
        {/* Redirect root to feed for now */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
