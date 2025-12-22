import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginScreen";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ContentManagement from "./pages/ContentManagement";
import Settings from "./pages/Settings";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminAPI from "./services/api";
import React, { useEffect, useState } from "react";

// Component to handle login page - default route
function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = AdminAPI.isAuthenticated();
    setIsAuthenticated(authStatus);
    setIsChecking(false);
  }, []);

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show login screen (default)
  return <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - Login Screen */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch all unknown routes - redirect to login (default) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
