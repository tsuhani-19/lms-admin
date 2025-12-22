import { useState } from "react";
import { FiFileText, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { AiFillHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import AdminAPI from "../services/api";
import React from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <AiFillHome /> },
    { name: "User Management", path: "/users", icon: <FaUser /> },
    { name: "Content Management", path: "/content", icon: <FiFileText /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  const handleLogout = () => {
    AdminAPI.logout();
    navigate("/");
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
        className={`fixed md:static top-0 left-0 h-screen w-60 md:w-64 bg-[#3E0288] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        z-40 md:z-auto flex-shrink-0
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo with close button on mobile */}
        <div className="relative flex items-center justify-between px-4 md:px-6 py-4 md:py-6 text-lg md:text-xl font-semibold border-b border-white/20">
          <span className="whitespace-nowrap">Learning Journey Loop</span>
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
                className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-xs md:text-sm
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
            className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg hover:bg-white/10 transition text-white text-xs md:text-sm"
          >
            <BiLogOut className="text-base md:text-lg flex-shrink-0" />
            <span>Log Out</span>
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
    </>
  );
}
