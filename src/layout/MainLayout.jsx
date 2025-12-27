import Sidebar from "../components/SidePanel";
import { Outlet } from "react-router-dom";
import React from 'react'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Page Content */}
      <main className="flex-1 w-full md:w-auto overflow-x-hidden md:ml-64 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
