import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages and Components
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import ClientPage from './pages/ClientPage';
import AuthForm from './components/AuthForm';
import useAnimatedFavicon from "./hooks/useAnimatedFavicon";

function App() {
  useAnimatedFavicon();
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/signup" element={<AuthForm />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Client Route */}
        <Route
          path="/client"
          element={
            <ProtectedRoute role="client">
              <ClientPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback for Unknown Routes */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
