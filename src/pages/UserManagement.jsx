import React, { useState, useEffect } from "react";
import { FiMoreVertical, FiX } from "react-icons/fi";
import AdminAPI from "../services/api";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("admins"); // "admins" or "users"
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailFilter, setEmailFilter] = useState("all"); // "all", "verified", "not_verified"

  const statusColors = {
    "Active": "bg-green-100 text-green-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    "In Active": "bg-red-100 text-red-800",
    "Completed": "bg-purple-100 text-purple-800",
  };

  // Fetch data on component mount and check user role
  useEffect(() => {
    // Check if current user is superadmin
    const adminData = AdminAPI.getAdminData();
    const isSuper = adminData && adminData.role === "superadmin";
    setIsSuperadmin(isSuper);
    
    // Set default tab based on role
    if (!isSuper) {
      setActiveTab("users"); // Regular admins only see users
    }
    
    // Fetch data based on role
    fetchUsers();
    if (isSuper) {
      fetchAdmins();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch admins when switching to admins tab (for superadmin)
  useEffect(() => {
    if (isSuperadmin && activeTab === "admins") {
      fetchAdmins();
    }
  }, [activeTab, isSuperadmin]);

  // Filter users when search term or email filter changes
  useEffect(() => {
    if (activeTab === "users") {
      let filtered = [...users];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(user =>
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply email verification filter
      if (emailFilter === "verified") {
        filtered = filtered.filter(user => user.emailVerified === true);
      } else if (emailFilter === "not_verified") {
        filtered = filtered.filter(user => user.emailVerified === false);
      }

      setFilteredUsers(filtered);
    }
  }, [users, searchTerm, emailFilter, activeTab]);

  const fetchAdmins = async () => {
    // Only fetch admins if user is superadmin
    if (!isSuperadmin) {
      setAdmins([]);
      return;
    }
    
    try {
      const response = await AdminAPI.getAllAdmins();
      if (response.success && response.data) {
        setAdmins(response.data);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      setAdmins([]);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await AdminAPI.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setSubmitting(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setSubmitting(false);
      return;
    }

    try {
      const response = await AdminAPI.createAdmin(
        formData.name,
        formData.email,
        formData.password
      );

      if (response.success) {
        setSuccess("Admin created successfully!");
        // Reset form
        setFormData({ name: "", email: "", password: "" });
        // Close modal after a short delay
        setTimeout(() => {
          setShowForm(false);
          setSuccess("");
          // Refresh admins list
          fetchAdmins();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Failed to create admin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: "", email: "", password: "" });
    setError("");
    setSuccess("");
  };

  return (
    <div className="bg-gray-50 w-full h-screen overflow-hidden flex flex-col">
      {/* Main Container */}
      <div className="bg-white rounded-[20px] w-full flex flex-col flex-1 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 flex-shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold text-[#3E0288]">User Management</h1>
            <p
              className="text-[#3E0288] font-normal text-[14px] leading-[36px] mt-1"
              style={{ fontFamily: "'SF Compact Rounded', sans-serif", letterSpacing: "0%", maxWidth: "420px" }}
            >
              Manage your employees, roles, and departments efficiently.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1 md:mt-0">
            {isSuperadmin && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#3E0288] text-white px-5 py-2 rounded-lg shadow hover:bg-[#2c015e] transition text-sm"
              >
                Add Employee
              </button>
            )}
            <button className="border border-[#3E0288] text-[#3E0288] px-5 py-2 rounded-lg hover:bg-[#f5f0ff] transition text-sm">
              Upload CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200 flex-shrink-0">
          {isSuperadmin && (
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-4 py-2 font-medium text-sm transition ${
                activeTab === "admins"
                  ? "text-[#3E0288] border-b-2 border-[#3E0288]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Admins ({admins.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium text-sm transition ${
              activeTab === "users"
                ? "text-[#3E0288] border-b-2 border-[#3E0288]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Learners ({activeTab === "users" ? filteredUsers.length : users.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 flex-shrink-0">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border border-gray-300 rounded-lg px-2 h-[38px] focus:outline-none focus:ring-2 focus:ring-[#3E0288] w-[250px] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {activeTab === "users" && (
            <select 
              className="border border-gray-300 rounded-lg px-2 h-[38px] focus:outline-none focus:ring-2 focus:ring-[#3E0288] w-[250px] text-sm"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            >
              <option value="all">All Email Status</option>
              <option value="verified">Verified</option>
              <option value="not_verified">Not Verified</option>
            </select>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white mt-8 flex-1 min-h-0 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              Loading...
            </div>
          ) : activeTab === "admins" ? (
            admins.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
                No admins found. Click "Add Employee" to create one.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[13px]">
                <thead className="bg-[#f8f6ff] text-gray-500 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created At</th>
                    <th className="px-4 py-3 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-[#faf8ff] transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {admin.fullName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {admin.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            admin.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <FiMoreVertical className="inline-block cursor-pointer text-gray-400 hover:text-[#3E0288] transition" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              No users found matching the current filters.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-[13px]">
              <thead className="bg-[#f8f6ff] text-gray-500 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Email Verified</th>
                  <th className="px-4 py-3 font-medium">Created At</th>
                  <th className="px-4 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#faf8ff] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {user.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.emailVerified
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {user.emailVerified ? "Verified" : "Not Verified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <FiMoreVertical className="inline-block cursor-pointer text-gray-400 hover:text-[#3E0288] transition" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-3 sm:gap-0 flex-shrink-0">
          <p className="text-gray-500 text-sm">
            Showing {activeTab === "admins" ? admins.length : filteredUsers.length} {activeTab === "admins" ? "admin" : "user"}
            {activeTab === "admins" ? (admins.length !== 1 ? 's' : '') : (filteredUsers.length !== 1 ? 's' : '')}
          </p>
          <div className="flex gap-2">
            {/* Pagination can be added here if needed */}
          </div>
        </div>
      </div>

      {/* Add Admin Sidebar */}
      {showForm && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-white bg-opacity-50 z-40"
            onClick={handleCloseForm}
          ></div>
          
          {/* Right Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white flex-shrink-0">
              <h2 className="text-2xl font-semibold text-[#3E0288]">Add New Admin</h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700 transition p-1"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Sidebar Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-white">
              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288]"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288]"
                  placeholder="Enter email address"
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288]"
                  placeholder="Enter password (min 6 characters)"
                />
                <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition bg-white"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:bg-[#2c015e] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
