import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiRefreshCw, FiX, FiCheck, FiChevronDown, FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminAPI from "../services/api";
import { usePermissions } from "../contexts/PermissionsContext";

export default function RolesPermissionsManagement() {
  const { t } = useTranslation(['common']);
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const hasFetchedRef = useRef(false);

  // Check permissions and fetch data on component mount
  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetchedRef.current) return;
    
    // Wait for permissions to load
    if (permissionsLoading) return;

    // Check if user has permission to access this page
    if (!hasPermission("role:view")) {
      // Redirect to dashboard if no permission
      navigate("/dashboard", { replace: true });
      return;
    }

    // Mark as fetched to prevent duplicate calls
    hasFetchedRef.current = true;

    // User has permission, fetch data
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsLoading]);

  const fetchData = async () => {
    // Check if user is authenticated before fetching
    if (!AdminAPI.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [rolesRes, permissionsRes, mappingsRes] = await Promise.all([
        AdminAPI.getAllRoles(),
        AdminAPI.getAllPermissions(),
        AdminAPI.getAllRolePermissions(),
      ]);

      if (rolesRes.success) {
        setRoles(rolesRes.data || []);
      }

      if (permissionsRes.success) {
        setPermissions(permissionsRes.data || []);
      }

      if (mappingsRes.success) {
        // Transform mappings into a more usable format
        const mappings = {};
        if (mappingsRes.data?.mappings) {
          mappingsRes.data.mappings.forEach((mapping) => {
            const roleName = mapping.role.name;
            const roleId = mapping.role.id;
            if (!mappings[roleName]) {
              mappings[roleName] = {
                role: mapping.role,
                permissions: [],
              };
            }
            // Add permissions if they don't already exist (avoid duplicates)
            mapping.permissions.forEach((perm) => {
              if (!mappings[roleName].permissions.find(p => p.id === perm.id)) {
                mappings[roleName].permissions.push(perm);
              }
            });
          });
        }
        setRolePermissions(mappings);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load roles and permissions. Please try again.");
      // Use sample data as fallback
      setRoles(getSampleRoles());
      setPermissions(getSamplePermissions());
      setRolePermissions(getSampleRolePermissions());
    } finally {
      setLoading(false);
    }
  };

  // Sample data fallback
  const getSampleRoles = () => [
    { id: "1", name: "super_admin", description: "Super Administrator with full system access" },
    { id: "2", name: "admin", description: "Administrator with access to all system features" },
    { id: "3", name: "branch_manager", description: "Branch Manager with access to branch operations" },
  ];

  const getSamplePermissions = () => [
    { id: "1", name: "user:view", description: "View users" },
    { id: "2", name: "user:create", description: "Create users" },
    { id: "3", name: "user:update", description: "Update users" },
    { id: "4", name: "user:delete", description: "Delete users" },
    { id: "5", name: "content:view", description: "View content" },
    { id: "6", name: "content:create", description: "Create content" },
  ];

  const getSampleRolePermissions = () => ({
    super_admin: {
      role: { id: "1", name: "super_admin", description: "Super Administrator with full system access" },
      permissions: getSamplePermissions(),
    },
    admin: {
      role: { id: "2", name: "admin", description: "Administrator with access to all system features" },
      permissions: getSamplePermissions().slice(0, 4),
    },
  });

  const handleCreateRole = async () => {
    // Check permission
    if (!hasPermission("role:create")) {
      setError("You are not authorized to perform this action. You need 'role create' permission.");
      return;
    }

    if (!newRoleName.trim() || !newRoleDescription.trim()) {
      setError("Role name and description are required");
      return;
    }

    try {
      // Create the role first
      const response = await AdminAPI.createRole(newRoleName.trim(), newRoleDescription.trim());
      if (response.success) {
        const newRole = response.data;
        
        // Assign selected permissions to the new role
        if (selectedPermissions.length > 0) {
          try {
            // Assign permissions one by one
            const permissionPromises = selectedPermissions.map(permissionId =>
              AdminAPI.addPermissionToRole(newRole.id, permissionId)
            );
            await Promise.all(permissionPromises);
          } catch (permErr) {
            console.error("Error assigning permissions:", permErr);
            // Role was created but permissions failed - show warning but don't fail
            setError("Role created but some permissions could not be assigned. You can assign them manually.");
          }
        }

        // Reset form
        setNewRoleName("");
        setNewRoleDescription("");
        setSelectedPermissions([]);
        setPermissionSearchTerm("");
        setShowCreateModal(false);
        setError(null);
        
        // Refresh data to get updated mappings
        fetchData();
      }
    } catch (err) {
      setError(err.message || "Failed to create role");
    }
  };

  const handleTogglePermission = async (roleId, permissionId, isAssigned) => {
    // Check permission
    if (!hasPermission("role:update")) {
      setError("You are not authorized to perform this action. You need 'role update' permission.");
      return;
    }

    try {
      if (isAssigned) {
        await AdminAPI.removePermissionFromRole(roleId, permissionId);
      } else {
        await AdminAPI.addPermissionToRole(roleId, permissionId);
      }
      // Refresh data
      fetchData();
    } catch (err) {
      setError(err.message || "Failed to update permission");
    }
  };

  const openPermissionModal = (role) => {
    // Check permission
    if (!hasPermission("role:update")) {
      setError("You are not authorized to perform this action. You need 'role update' permission.");
      return;
    }

    setSelectedRole(role);
    setShowPermissionModal(true);
  };

  const handleTogglePermissionSelection = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  // Filter permissions for the create role modal
  const filteredPermissionsForCreate = permissions.filter((permission) =>
    permission.name?.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
    permission.description?.toLowerCase().includes(permissionSearchTerm.toLowerCase())
  );

  // Filter roles based on search
  const filteredRoles = roles.filter((role) =>
    role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format role name for display
  const formatRoleName = (roleName) => {
    if (!roleName) return "N/A";
    return roleName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get permissions for a role
  const getRolePermissionsList = (roleName) => {
    return rolePermissions[roleName]?.permissions || [];
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
  if (!hasPermission("role:view")) {
    return null;
  }

  // Check if permission is assigned to role
  const isPermissionAssigned = (roleId, permissionId) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return false;
    const rolePerms = getRolePermissionsList(role.name);
    return rolePerms.some(p => p.id === permissionId);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Roles & Permissions
            </h1>
            <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Manage roles and their assigned permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold disabled:opacity-50"
            >
              <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            {/* Create Role Button - Show to all users with view permission */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
            >
              <FiPlus size={16} />
              Create Role
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
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
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
            placeholder="Search roles by name or description"
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
            <p>Loading roles and permissions...</p>
          </div>
        </div>
      )}

      {/* Roles Table */}
      {!loading && (
        <div className="px-6 mb-6">
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Role Name</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Permissions</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 px-4 text-center text-gray-500">
                        No roles found
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role) => {
                      const rolePerms = getRolePermissionsList(role.name);
                      return (
                        <tr
                          key={role.id}
                          className="border-b border-gray-100 hover:bg-white transition"
                        >
                          <td className="py-4 px-4">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {formatRoleName(role.name)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {role.description || "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {rolePerms.length > 0 ? (
                                <>
                                  {rolePerms.slice(0, 3).map((perm) => (
                                    <span
                                      key={perm.id}
                                      className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                    >
                                      {perm.name}
                                    </span>
                                  ))}
                                  {rolePerms.length > 3 && (
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                      +{rolePerms.length - 3} more
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400 text-xs">No permissions</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => openPermissionModal(role)}
                              className="text-[#3E0288] hover:text-purple-700 transition text-sm font-semibold"
                            >
                              Manage Permissions
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#3E0288] text-xl font-semibold">Create New Role</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRoleName("");
                  setNewRoleDescription("");
                  setSelectedPermissions([]);
                  setPermissionSearchTerm("");
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-6">
              {/* Role Details Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g., content_manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Describe the role's purpose and responsibilities"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                </div>
              </div>

              {/* Permissions Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Assign Permissions ({selectedPermissions.length} selected)
                  </label>
                  <span className="text-xs text-gray-500">Select permissions for this role</span>
                </div>
                
                {/* Permission Search */}
                <div className="relative mb-4">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={permissionSearchTerm}
                    onChange={(e) => setPermissionSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                </div>

                {/* Permissions List */}
                <div className="border border-gray-200 rounded-lg max-h-[300px] overflow-y-auto">
                  {filteredPermissionsForCreate.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      {permissions.length === 0 ? "No permissions available" : "No permissions match your search"}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredPermissionsForCreate.map((permission) => {
                        const isSelected = selectedPermissions.includes(permission.id);
                        return (
                          <div
                            key={permission.id}
                            className={`p-3 hover:bg-gray-50 cursor-pointer transition ${
                              isSelected ? "bg-purple-50" : ""
                            }`}
                            onClick={() => handleTogglePermissionSelection(permission.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleTogglePermissionSelection(permission.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4 text-[#3E0288] border-gray-300 rounded focus:ring-[#3E0288] cursor-pointer"
                                  />
                                  <div>
                                    <div className="font-medium text-sm text-gray-700">{permission.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{permission.description}</div>
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <FiCheck className="text-[#3E0288] flex-shrink-0" size={18} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {selectedPermissions.length > 0 && (
                  <div className="mt-3 text-xs text-gray-600">
                    {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? "s" : ""} selected
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRoleName("");
                  setNewRoleDescription("");
                  setSelectedPermissions([]);
                  setPermissionSearchTerm("");
                  setError(null);
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
              >
                Create Role {selectedPermissions.length > 0 && `(${selectedPermissions.length} permissions)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Permissions Modal */}
      {showPermissionModal && selectedRole && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[#3E0288] text-xl font-semibold">
                  Manage Permissions: {formatRoleName(selectedRole.name)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{selectedRole.description}</p>
              </div>
              <button
                onClick={() => {
                  setShowPermissionModal(false);
                  setSelectedRole(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {permissions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No permissions available</p>
              ) : (
                permissions.map((permission) => {
                  const isAssigned = isPermissionAssigned(selectedRole.id, permission.id);
                  return (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-700">{permission.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{permission.description}</div>
                      </div>
                      <button
                        onClick={() => handleTogglePermission(selectedRole.id, permission.id, isAssigned)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isAssigned
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {isAssigned ? (
                          <span className="flex items-center gap-1">
                            <FiCheck size={14} />
                            Assigned
                          </span>
                        ) : (
                          "Assign"
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowPermissionModal(false);
                  setSelectedRole(null);
                }}
                className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

