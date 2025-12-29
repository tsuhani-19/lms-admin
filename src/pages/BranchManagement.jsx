import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiChevronDown, FiRefreshCw, FiPlus, FiX, FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import AdminAPI from "../services/api";
import { usePermissions } from "../contexts/PermissionsContext";

export default function BranchManagement() {
  const { t } = useTranslation(['common']);
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [newBranch, setNewBranch] = useState({
    name: "",
    description: "",
    location: "",
  });
  const hasFetchedRef = useRef(false);

  // Check permissions and fetch data on component mount
  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetchedRef.current) return;
    
    // Wait for permissions to load
    if (permissionsLoading) return;

    // Check if user has permission to access this page
    if (!hasPermission("branch:view")) {
      // Redirect to dashboard if no permission
      navigate("/dashboard", { replace: true });
      return;
    }

    // Mark as fetched to prevent duplicate calls
    hasFetchedRef.current = true;

    // User has permission, fetch data
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsLoading]);

  // Filter branches when search term changes
  useEffect(() => {
    filterBranches();
  }, [searchTerm, branches]);

  const fetchBranches = async () => {
    // Check if user is authenticated before fetching
    if (!AdminAPI.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await AdminAPI.getAllBranches();

      if (response.success && response.data) {
        setBranches(response.data);
      } else {
        setBranches([]);
        setError(response.message || "Failed to fetch branches");
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
      setBranches([]);
      setError(err.message || "Unable to fetch branches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterBranches = () => {
    let filtered = [...branches];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(branch =>
        branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBranches(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedBranches = filteredBranches.slice(startIndex, endIndex);

  const handleCreateBranch = async () => {
    // Check permission
    if (!hasPermission("branch:create")) {
      setError("You are not authorized to perform this action. You need 'branch create' permission.");
      return;
    }

    // Validation
    if (!newBranch.name.trim()) {
      setError("Branch name is required");
      return;
    }

    try {
      setError(null);
      const response = await AdminAPI.createBranch(
        newBranch.name.trim(),
        newBranch.description?.trim() || "",
        newBranch.location?.trim() || ""
      );

      if (response.success) {
        // Reset form
        setNewBranch({
          name: "",
          description: "",
          location: "",
        });
        setShowCreateModal(false);
        setError(null);
        // Refresh branches list
        await fetchBranches();
      } else {
        setError(response.message || "Failed to create branch");
      }
    } catch (err) {
      setError(err.message || "Failed to create branch");
    }
  };

  const handleEditBranch = (branch) => {
    // Check permission
    if (!hasPermission("branch:update")) {
      setError("You are not authorized to perform this action. You need 'branch update' permission.");
      return;
    }

    setSelectedBranch(branch);
    setNewBranch({
      name: branch.name || "",
      description: branch.description || "",
      location: branch.location || "",
    });
    setShowEditModal(true);
    setError(null);
  };

  const handleUpdateBranch = async () => {
    if (!selectedBranch) return;

    // Check permission
    if (!hasPermission("branch:update")) {
      setError("You are not authorized to perform this action. You need 'branch update' permission.");
      return;
    }

    // Validation
    if (!newBranch.name.trim()) {
      setError("Branch name is required");
      return;
    }

    try {
      setError(null);
      const response = await AdminAPI.updateBranch(selectedBranch.id, {
        name: newBranch.name.trim(),
        description: newBranch.description?.trim() || "",
        location: newBranch.location?.trim() || "",
      });

      if (response.success) {
        setShowEditModal(false);
        setSelectedBranch(null);
        setNewBranch({
          name: "",
          description: "",
          location: "",
        });
        setError(null);
        // Refresh branches list
        await fetchBranches();
      } else {
        setError(response.message || "Failed to update branch");
      }
    } catch (err) {
      setError(err.message || "Failed to update branch");
    }
  };

  const handleDeleteBranch = async (branchId) => {
    // Check permission
    if (!hasPermission("branch:delete")) {
      setError("You are not authorized to perform this action. You need 'branch delete' permission.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this branch?")) {
      return;
    }

    try {
      setError(null);
      const response = await AdminAPI.deleteBranch(branchId);

      if (response.success) {
        // Refresh branches list
        await fetchBranches();
      } else {
        setError(response.message || "Failed to delete branch");
      }
    } catch (err) {
      setError(err.message || "Failed to delete branch");
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
  if (!hasPermission("branch:view")) {
    return null;
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Branch Management
            </h1>
            <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Manage all branches and their locations
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Create Branch Button - Show to all users with view permission */}
            <button
              onClick={() => {
                setShowCreateModal(true);
                setError(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
            >
              <FiPlus size={16} />
              Create Branch
            </button>
            {/* Refresh Button */}
            <button
              onClick={fetchBranches}
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

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, description, or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-6 mb-6">
          <div className="text-center py-8 text-gray-500">
            <FiRefreshCw className="animate-spin mx-auto mb-2" size={24} />
            <p>Loading branches...</p>
          </div>
        </div>
      )}

      {/* Branches Cards Grid */}
      {!loading && (
        <div className="px-6 mb-6">
          {displayedBranches.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-gray-500 text-lg">No branches found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Branch Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#3E0288] mb-1">
                        {branch.name || "N/A"}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {branch.id?.substring(0, 8)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditBranch(branch)}
                        className="text-[#3E0288] hover:text-purple-700 transition p-1.5 hover:bg-purple-50 rounded-lg"
                        title="Edit Branch"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="text-red-600 hover:text-red-700 transition p-1.5 hover:bg-red-50 rounded-lg"
                        title="Delete Branch"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Branch Description */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {branch.description || "No description available"}
                    </p>
                  </div>

                  {/* Branch Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiMapPin size={16} />
                    <span className="truncate">{branch.location || "Location not specified"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredBranches.length > 0 && (
        <div className="px-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {displayedBranches.length} of {filteredBranches.length} branches
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

      {/* Create Branch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#3E0288] text-xl font-semibold">Create New Branch</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBranch({ name: "", description: "", location: "" });
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
              {/* Branch Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  placeholder="Enter branch name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newBranch.description}
                  onChange={(e) => setNewBranch({ ...newBranch, description: e.target.value })}
                  placeholder="Enter branch description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={newBranch.location}
                  onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                  placeholder="Enter branch location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBranch({ name: "", description: "", location: "" });
                  setError(null);
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBranch}
                className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
              >
                Create Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {showEditModal && selectedBranch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#3E0288] text-xl font-semibold">Edit Branch</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedBranch(null);
                  setNewBranch({ name: "", description: "", location: "" });
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
              {/* Branch Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  placeholder="Enter branch name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newBranch.description}
                  onChange={(e) => setNewBranch({ ...newBranch, description: e.target.value })}
                  placeholder="Enter branch description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={newBranch.location}
                  onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                  placeholder="Enter branch location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedBranch(null);
                  setNewBranch({ name: "", description: "", location: "" });
                  setError(null);
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBranch}
                className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
              >
                Update Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

