import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginScreen";
import Dashboard from "./pages/Dashboard";
import ViewAnalytics from "./pages/ViewAnalytics";
import UserManagement from "./pages/UserManagement";
import AdminManagement from "./pages/AdminManagement";
import RolesPermissionsManagement from "./pages/RolesPermissionsManagement";
import BranchManagement from "./pages/BranchManagement";
import DepartmentManagement from "./pages/DepartmentManagement";
import EmployeeDetails from "./pages/EmployeeDetails";
import ProgressMonitoring from "./pages/ProgressMonitoring";
import ReportsExport from "./pages/ReportsExport";
import ContentManagement from "./pages/ContentManagement";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import CompanyDetails from "./pages/CompanyDetails";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import AdminAPI from "./services/api";
import React, { useEffect, useState } from "react";

// Component to handle login page - default route
function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // API integration commented out for UI development
    // Check if user is already authenticated
    // const authStatus = AdminAPI.isAuthenticated();
    // setIsAuthenticated(authStatus);
    setIsAuthenticated(false); // Always show login for UI development
    setIsChecking(false);
  }, []);

  // If authenticated, redirect to dashboard
  // if (isAuthenticated) {
  //   return <Navigate to="/dashboard" replace />;
  // }

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
          <Route element={
            <PermissionsProvider>
              <MainLayout />
            </PermissionsProvider>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/viewanalytics" element={<ViewAnalytics />} />
            <Route path="/dashboard/reports" element={<ReportsExport />} />
            <Route path="/progress-monitoring" element={<ProgressMonitoring />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/:id" element={<EmployeeDetails />} />
            <Route path="/admins" element={<AdminManagement />} />
            <Route path="/roles-permissions" element={<RolesPermissionsManagement />} />
            <Route path="/branches" element={<BranchManagement />} />
            <Route path="/departments" element={<DepartmentManagement />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/company-details" element={<CompanyDetails />} />
          </Route>
        </Route>

        {/* Catch all unknown routes - redirect to login (default) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
