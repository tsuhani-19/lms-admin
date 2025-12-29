import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiChevronDown, FiRefreshCw, FiPlus, FiX, FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";
import AdminAPI from "../services/api";
import { usePermissions } from "../contexts/PermissionsContext";

export default function AdminManagement() {
  const { t } = useTranslation(['common']);
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role_id: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, adminId: null, adminName: "" });
  const hasFetchedRef = useRef(false);

  // Roles to exclude (employees)
  const excludedRoles = ['employee'];

  // Check permissions and fetch data on component mount
  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetchedRef.current) return;
    
    // Wait for permissions to load
    if (permissionsLoading) return;

    // Check if user has permission to access this page
    if (!hasPermission("admin:manage")) {
      // Redirect to dashboard if no permission
      navigate("/dashboard", { replace: true });
      return;
    }

    // Mark as fetched to prevent duplicate calls
    hasFetchedRef.current = true;

    // User has permission, fetch data
    fetchAdmins();
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsLoading]);

  const fetchRoles = async () => {
    // Check if user is authenticated before fetching
    if (!AdminAPI.isAuthenticated()) {
      return;
    }

    try {
      const response = await AdminAPI.getAllRoles();
      if (response.success && response.data) {
        // Filter out employee role
        const adminRoles = response.data.filter(role => 
          role.name?.toLowerCase() !== 'employee'
        );
        setRoles(adminRoles);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      // Don't show error if it's just authentication issue
      if (err.message !== "No authentication token found") {
        setError("Failed to fetch roles. Please refresh the page.");
      }
    }
  };

  // Filter admins when search term or role filter changes
  useEffect(() => {
    filterAdmins();
  }, [searchTerm, roleFilter, admins]);

  const fetchAdmins = async () => {
    // Check if user is authenticated before fetching
    if (!AdminAPI.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch users - we'll filter on frontend
      // Note: This assumes there's an endpoint to get all users with roles
      // If not available, you may need to create a backend endpoint
      const response = await AdminAPI.authenticatedRequest("/user/admins", {
        method: "GET",
      });

      if (response.success && response.data) {
        // Backend already filters out employees, so use data directly
        setAdmins(response.data);
      } else {
        // Fallback: Use sample data if API is not available
        setAdmins(getSampleAdmins());
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      // Show the actual error message from backend
      setError(err.message || "Unable to fetch admins. Please check your permissions.");
      setAdmins([]); // Don't show sample data on error
    } finally {
      setLoading(false);
    }
  };

  // Sample data fallback
  const getSampleAdmins = () => {
    return [
      {
        id: "1",
        full_name: "John Doe",
        role: { name: "super_admin", description: "Super Administrator with full system access" }
      },
      {
        id: "2",
        full_name: "Jane Smith",
        role: { name: "admin", description: "Administrator with access to all system features" }
      },
      {
        id: "3",
        full_name: "Mike Johnson",
        role: { name: "branch_manager", description: "Branch Manager with access to branch operations" }
      },
      {
        id: "4",
        full_name: "Sarah Williams",
        role: { name: "department_manager", description: "Department Manager with access to department operations" }
      },
      {
        id: "5",
        full_name: "David Brown",
        role: { name: "instructor", description: "Instructor with access to content operations" }
      },
      {
        id: "6",
        full_name: "Emily Davis",
        role: { name: "human_resource", description: "Human Resource with access to user operations" }
      },
    ];
  };

  const filterAdmins = () => {
    let filtered = [...admins];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(admin =>
        admin.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(admin =>
        admin.role?.name?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    setFilteredAdmins(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Get unique roles for filter dropdown
  const uniqueRoles = [...new Set(admins.map(admin => admin.role?.name).filter(Boolean))];

  // Pagination
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedAdmins = filteredAdmins.slice(startIndex, endIndex);

  // Format role name for display
  const formatRoleName = (roleName) => {
    if (!roleName) return "N/A";
    return roleName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleCreateUser = async () => {
    // Check permission
    if (!hasPermission("user:create")) {
      setError("You are not authorized to perform this action. You need 'user create' permission.");
      return;
    }

    // Validation
    if (!newUser.full_name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!newUser.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!newUser.password) {
      setError("Password is required");
      return;
    }
    if (newUser.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (newUser.password !== newUser.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (!newUser.role_id) {
      setError("Please select a role");
      return;
    }

    try {
      setError(null);
      const response = await AdminAPI.createUserWithRole(
        newUser.full_name.trim(),
        newUser.email.trim(),
        newUser.password,
        newUser.role_id
      );

      if (response.success) {
        // Reset form
        setNewUser({
          full_name: "",
          email: "",
          password: "",
          confirm_password: "",
          role_id: "",
        });
        setShowCreateModal(false);
        setError(null);
        // Refresh admins list
        fetchAdmins();
      }
    } catch (err) {
      setError(err.message || "Failed to create user");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!hasPermission("admin:manage")) {
      setError("You are not authorized to perform this action. You need 'admin manage' permission.");
      setDeleteConfirm({ show: false, adminId: null, adminName: "" });
      return;
    }

    if (!deleteConfirm.adminId) return;

    try {
      setError(null);
      const response = await AdminAPI.deleteAdmin(deleteConfirm.adminId);

      if (response.success) {
        // Refresh the admins list
        await fetchAdmins();
        setDeleteConfirm({ show: false, adminId: null, adminName: "" });
      }
    } catch (err) {
      setError(err.message || "Failed to delete admin");
      setDeleteConfirm({ show: false, adminId: null, adminName: "" });
    }
  };

  const getSelectedRoleDescription = () => {
    const selectedRole = roles.find(r => r.id === newUser.role_id);
    return selectedRole?.description || "";
  };

  // Show loading while checking permissions
  if (permissionsLoading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have permission, don't render the page (will redirect)
  if (!hasPermission("admin:manage")) {
    return null;
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Admin Management
            </h1>
            <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Manage all administrators, super admins, and staff (excluding employees)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Create User Button - Show to all users with view permission */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
            >
              <FiPlus size={16} />
              Create User
            </button>
            {/* Refresh Button */}
            <button
              onClick={fetchAdmins}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold disabled:opacity-50"
            >
              <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            {/* Language Selector */}
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <span className="text-sm font-semibold">Eng (US)</span>
              <span className="text-lg">🇺🇸</span>
              <FiChevronDown className="text-gray-400" size={14} />
            </div>
            {/* Profile Picture */}
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-[#3E0288] flex items-center justify-center text-white font-semibold hover:opacity-90 transition cursor-pointer"
              title="View Profile"
            >
              A
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 mb-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="px-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, role, or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer min-w-[180px]"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {formatRoleName(role)}
                </option>
              ))}
            </select>
            <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-6 mb-6">
          <div className="text-center py-8 text-gray-500">
            <FiRefreshCw className="animate-spin mx-auto mb-2" size={24} />
            <p>Loading admins...</p>
          </div>
        </div>
      )}

      {/* Admins Table */}
      {!loading && (
        <div className="px-6 mb-6">
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">ID</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Role Name</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Role Description</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAdmins.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 px-4 text-center text-gray-500">
                        No admins found
                      </td>
                    </tr>
                  ) : (
                    displayedAdmins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-b border-gray-100 hover:bg-white transition"
                      >
                        <td className="py-4 px-4 text-sm text-gray-700 font-mono">
                          {admin.id?.substring(0, 8)}...
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 font-medium">
                          {admin.full_name || "N/A"}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            {formatRoleName(admin.role?.name)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {admin.role?.description || "N/A"}
                        </td>
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              if (!hasPermission("admin:manage")) {
                                setError("You are not authorized to perform this action. You need 'admin manage' permission.");
                                return;
                              }
                              setDeleteConfirm({ show: true, adminId: admin.id, adminName: admin.full_name || admin.email });
                            }}
                            className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-lg"
                            title="Delete admin"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredAdmins.length > 0 && (
        <div className="px-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {displayedAdmins.length} of {filteredAdmins.length} admins
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                      currentPage === pageNum
                        ? "bg-[#3E0288] text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-[#3E0288] text-xl font-semibold mb-4">Delete Admin</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.adminName}</strong>? This action cannot be undone.
            </p>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteConfirm({ show: false, adminId: null, adminName: "" });
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAdmin}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#3E0288] text-xl font-semibold">Create New User</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewUser({
                    full_name: "",
                    email: "",
                    password: "",
                    confirm_password: "",
                    role_id: "",
                  });
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Error Message in Modal */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password (min 8 characters)"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={newUser.confirm_password}
                    onChange={(e) => setNewUser({ ...newUser, confirm_password: e.target.value })}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={newUser.role_id}
                  onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {formatRoleName(role.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Description */}
              {newUser.role_id && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-purple-700 mb-1">Role Description:</p>
                  <p className="text-sm text-purple-600">{getSelectedRoleDescription()}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewUser({
                    full_name: "",
                    email: "",
                    password: "",
                    confirm_password: "",
                    role_id: "",
                  });
                  setError(null);
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

