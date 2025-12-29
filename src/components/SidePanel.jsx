import { useState } from "react";
import { FiFileText, FiSettings, FiMenu, FiX, FiUser, FiShield, FiLock, FiMapPin, FiBriefcase } from "react-icons/fi";
import { AiFillHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";
import { HiOfficeBuilding } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import AdminAPI from "../services/api";
import { usePermissions } from "../contexts/PermissionsContext";
import React from "react";

export default function Sidebar() {
  const { t } = useTranslation(['sidebar', 'common']);
  const { hasPermission } = usePermissions();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Define menu items with their required permissions
  const allMenuItems = [
    { name: t("dashboard"), path: "/dashboard", icon: <AiFillHome />, permission: null }, // Always visible
    { name: t("userManagement"), path: "/users", icon: <FaUser />, permission: "user:view" },
    { name: "Branch Management", path: "/branches", icon: <FiMapPin />, permission: "branch:view" },
    { name: "Department Management", path: "/departments", icon: <FiBriefcase />, permission: "department:view" },  
    { name: t("contentManagement"), path: "/content", icon: <FiFileText />, permission: "content:view" },
    { name: "Admin Management", path: "/admins", icon: <FiShield />, permission: "admin:manage" },
    { name: "Roles & Permissions", path: "/roles-permissions", icon: <FiLock />, permission: "role:view" },
    { name: "Company Details", path: "/company-details", icon: <HiOfficeBuilding />, permission: null }, // Always visible
    { name: t("settings"), path: "/settings", icon: <FiSettings />, permission: null }, // Always visible
  ];

  // Filter menu items based on permissions
  const menuItems = allMenuItems.filter(item => {
    if (!item.permission) return true; // No permission required
    return hasPermission(item.permission);
  });

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    AdminAPI.logout();
    navigate("/");
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Mobile toggle button - only show menu icon when sidebar is closed */}
      {!open && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden text-white bg-[#3E0288] p-2 rounded-lg shadow-md"
          onClick={() => setOpen(!open)}
        >
          <FiMenu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-60 md:w-64 bg-[#3E0288] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        z-40 flex-shrink-0
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo with close button on mobile */}
        <div className="relative flex items-center justify-between px-4 md:px-6 py-4 md:py-6 text-lg md:text-xl font-semibold border-b border-white/20">
          <div className="flex flex-col leading-tight" style={{ fontFamily: 'Jura, sans-serif' }}>
            <span className="text-2xl font-bold text-center">Learning</span>
            <span className="text-2xl font-bold">Journey Loop</span>
          </div>
          {/* Close button inside sidebar header on mobile */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded transition flex items-center justify-center"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-2 md:px-4 py-4 md:py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false); // auto-close on mobile
                }}
                className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-base
                transition-all duration-200
                ${isActive ? "bg-white text-[#3E0288] font-semibold" : "text-white hover:bg-white/10"}`}
              >
                <span className="text-base md:text-lg flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 md:px-4 py-4 md:py-6 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg hover:bg-white/10 transition text-white text-sm md:text-base"
          >
            <BiLogOut className="text-base md:text-lg flex-shrink-0" />
            <span>{t("logOut")}</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={cancelLogout}
          >
            {/* Modal */}
            <div
              className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[#3E0288] text-xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                {t("confirmLogout")}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {t("logoutMessage")}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelLogout}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
                >
                  {t("common:cancel")}
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
                >
                  {t("logOut")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
