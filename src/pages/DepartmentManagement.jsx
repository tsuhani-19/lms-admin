import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiChevronDown, FiRefreshCw, FiPlus, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminAPI from "../services/api";
import { usePermissions } from "../contexts/PermissionsContext";

export default function DepartmentManagement() {
  const { t } = useTranslation(['common']);
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    branch_id: "",
  });
  const hasFetchedRef = useRef(false);

  // Check permissions and fetch data on component mount
  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetchedRef.current) return;
    
    // Wait for permissions to load
    if (permissionsLoading) return;

    // Check if user has permission to access this page
    if (!hasPermission("department:view")) {
      // Redirect to dashboard if no permission
      navigate("/dashboard", { replace: true });
      return;
    }

    // Mark as fetched to prevent duplicate calls
    hasFetchedRef.current = true;

    // User has permission, fetch data
    fetchDepartments();
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsLoading]);

  // Filter departments when search term or branch filter changes
  useEffect(() => {
    filterDepartments();
  }, [searchTerm, branchFilter, departments]);

  const fetchBranches = async () => {
    // Check if user is authenticated before fetching
    if (!AdminAPI.isAuthenticated()) {
      return;
    }

    try {
      const response = await AdminAPI.getAllBranches();
      if (response.success && response.data) {
        setBranches(response.data);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const fetchDepartments = async () => {
    // Check if user is authenticated before fetching
    if (!AdminAPI.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await AdminAPI.getAllDepartments();

      if (response.success && response.data) {
        setDepartments(response.data);
      } else {
        setDepartments([]);
        setError(response.message || "Failed to fetch departments");
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
      setError(err.message || "Unable to fetch departments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterDepartments = () => {
    let filtered = [...departments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(dept =>
        dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.branch?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply branch filter
    if (branchFilter) {
      filtered = filtered.filter(dept =>
        dept.branch?.id === branchFilter || dept.branch_id === branchFilter
      );
    }

    setFilteredDepartments(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Get unique branches for filter dropdown
  const uniqueBranches = branches.filter((branch, index, self) =>
    index === self.findIndex(b => b.id === branch.id)
  );

  // Pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedDepartments = filteredDepartments.slice(startIndex, endIndex);

  const handleCreateDepartment = async () => {
    // Check permission
    if (!hasPermission("department:create")) {
      setError("You are not authorized to perform this action. You need 'department create' permission.");
      return;
    }

    // Validation
    if (!newDepartment.name.trim()) {
      setError("Department name is required");
      return;
    }
    if (!newDepartment.branch_id) {
      setError("Branch is required");
      return;
    }

    try {
      setError(null);
      const response = await AdminAPI.createDepartment(
        newDepartment.name.trim(),
        newDepartment.description?.trim() || "",
        newDepartment.branch_id
      );

      if (response.success) {
        // Reset form
        setNewDepartment({
          name: "",
          description: "",
          branch_id: "",
        });
        setShowCreateModal(false);
        setError(null);
        // Refresh departments list
        await fetchDepartments();
      } else {
        setError(response.message || "Failed to create department");
      }
    } catch (err) {
      setError(err.message || "Failed to create department");
    }
  };

  const handleEditDepartment = (department) => {
    // Check permission
    if (!hasPermission("department:update")) {
      setError("You are not authorized to perform this action. You need 'department update' permission.");
      return;
    }

    setSelectedDepartment(department);
    setNewDepartment({
      name: department.name || "",
      description: department.description || "",
      branch_id: department.branch?.id || department.branch_id || "",
    });
    setShowEditModal(true);
    setError(null);
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDepartment) return;

    // Check permission
    if (!hasPermission("department:update")) {
      setError("You are not authorized to perform this action. You need 'department update' permission.");
      return;
    }

    // Validation
    if (!newDepartment.name.trim()) {
      setError("Department name is required");
      return;
    }
    if (!newDepartment.branch_id) {
      setError("Branch is required");
      return;
    }

    try {
      setError(null);
      const response = await AdminAPI.updateDepartment(selectedDepartment.id, {
        name: newDepartment.name.trim(),
        description: newDepartment.description?.trim() || "",
        branch_id: newDepartment.branch_id,
      });

      if (response.success) {
        setShowEditModal(false);
        setSelectedDepartment(null);
        setNewDepartment({
          name: "",
          description: "",
          branch_id: "",
        });
        setError(null);
        // Refresh departments list
        await fetchDepartments();
      } else {
        setError(response.message || "Failed to update department");
      }
    } catch (err) {
      setError(err.message || "Failed to update department");
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    // Check permission
    if (!hasPermission("department:delete")) {
      setError("You are not authorized to perform this action. You need 'department delete' permission.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      setError(null);
      const response = await AdminAPI.deleteDepartment(departmentId);

      if (response.success) {
        // Refresh departments list
        await fetchDepartments();
      } else {
        setError(response.message || "Failed to delete department");
      }
    } catch (err) {
      setError(err.message || "Failed to delete department");
    }
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
  if (!hasPermission("department:view")) {
    return null;
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Department Management
            </h1>
            <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Manage all departments and their branch associations
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Create Department Button - Show to all users with view permission */}
            <button
              onClick={() => {
                setShowCreateModal(true);
                setError(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
            >
              <FiPlus size={16} />
              Create Department
            </button>
            {/* Refresh Button */}
            <button
              onClick={fetchDepartments}
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
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-yellow-600 hover:text-yellow-800">
              <FiX size={18} />
            </button>
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
              placeholder="Search by name, description, or branch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
            />
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer min-w-[180px]"
            >
              <option value="">All Branches</option>
              {uniqueBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
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
            <p>Loading departments...</p>
          </div>
        </div>
      )}

      {/* Departments Table */}
      {!loading && (
        <div className="px-6 mb-6">
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">ID</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Branch</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedDepartments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 px-4 text-center text-gray-500">
                        No departments found
                      </td>
                    </tr>
                  ) : (
                    displayedDepartments.map((department) => (
                      <tr
                        key={department.id}
                        className="border-b border-gray-100 hover:bg-white transition"
                      >
                        <td className="py-4 px-4 text-sm text-gray-700 font-mono">
                          {department.id?.substring(0, 8)}...
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 font-medium">
                          {department.name || "N/A"}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {department.description || "N/A"}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {department.branch?.name || "No Branch" || "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditDepartment(department)}
                              className="text-[#3E0288] hover:text-purple-700 transition p-1"
                              title="Edit Department"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment(department.id)}
                              className="text-red-600 hover:text-red-700 transition p-1"
                              title="Delete Department"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
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
      {!loading && filteredDepartments.length > 0 && (
        <div className="px-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {displayedDepartments.length} of {filteredDepartments.length} departments
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

      {/* Create Department Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#3E0288] text-xl font-semibold">Create New Department</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDepartment({ name: "", description: "", branch_id: "" });
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
              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  placeholder="Enter department name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  placeholder="Enter department description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Branch Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch *
                </label>
                <select
                  value={newDepartment.branch_id}
                  onChange={(e) => setNewDepartment({ ...newDepartment, branch_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer"
                  required
                >
                  <option value="">Select a branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDepartment({ name: "", description: "", branch_id: "" });
                  setError(null);
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDepartment}
                className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
              >
                Create Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#3E0288] text-xl font-semibold">Edit Department</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDepartment(null);
                  setNewDepartment({ name: "", description: "", branch_id: "" });
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
              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  placeholder="Enter department name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  placeholder="Enter department description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Branch Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch *
                </label>
                <select
                  value={newDepartment.branch_id}
                  onChange={(e) => setNewDepartment({ ...newDepartment, branch_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer"
                  required
                >
                  <option value="">Select a branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDepartment(null);
                  setNewDepartment({ name: "", description: "", branch_id: "" });
                  setError(null);
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDepartment}
                className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
              >
                Update Department
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

