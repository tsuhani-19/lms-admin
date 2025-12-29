import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AdminAPI from "../services/api";

const PermissionsContext = createContext(null);

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Only fetch once when the provider mounts
    if (hasFetched) return;

    const fetchPermissions = async () => {
      // Check if user is authenticated before fetching
      if (!AdminAPI.isAuthenticated()) {
        setLoading(false);
        setPermissions([]);
        setIsSuperAdmin(false);
        setHasFetched(true);
        return;
      }

      try {
        setLoading(true);
        const response = await AdminAPI.getUserPermissions();
        if (response.success && response.data) {
          setPermissions(response.data.permissions || []);
          setIsSuperAdmin(response.data.isSuperAdmin || false);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setPermissions([]);
        setIsSuperAdmin(false);
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchPermissions();
  }, []); // Empty array - only run once on mount

  const hasPermission = useCallback((permissionName) => {
    if (isSuperAdmin) return true;
    return permissions.some((perm) => perm.name === permissionName);
  }, [isSuperAdmin, permissions]);

  const hasAnyPermission = useCallback((permissionNames) => {
    if (isSuperAdmin) return true;
    if (!Array.isArray(permissionNames)) {
      permissionNames = [permissionNames];
    }
    return permissionNames.some((perm) => hasPermission(perm));
  }, [isSuperAdmin, hasPermission]);

  const hasAllPermissions = useCallback((permissionNames) => {
    if (isSuperAdmin) return true;
    if (!Array.isArray(permissionNames)) {
      permissionNames = [permissionNames];
    }
    return permissionNames.every((perm) => hasPermission(perm));
  }, [isSuperAdmin, hasPermission]);

  const refreshPermissions = useCallback(async () => {
    setHasFetched(false);
    // This will trigger the useEffect to fetch again
  }, []);

  const value = {
    permissions,
    isSuperAdmin,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

