import Sidebar from "../components/SidePanel";
import { Outlet } from "react-router-dom";
import React from 'react'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Page Content */}
      <main className="flex-1 p-4 md:p-6 w-full md:w-auto">
        <Outlet />
      </main>
    </div>
  );
}
