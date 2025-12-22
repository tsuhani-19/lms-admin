// components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import AdminAPI from "../services/api";
import { useEffect, useState } from "react";
import React from "react";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = AdminAPI.isAuthenticated();
      setIsAuthenticated(authStatus);
      setIsChecking(false);
    };

    checkAuth();

    // Optional: Listen for storage changes (e.g., logout from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isChecking) {
    // Show loading state while checking
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
