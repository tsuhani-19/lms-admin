import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiDownload, FiChevronDown, FiAlertTriangle } from 'react-icons/fi';
import { HiUsers, HiBookOpen } from 'react-icons/hi';
import { AiOutlineRise } from 'react-icons/ai';
import { BsFileCheck } from 'react-icons/bs';

export default function ProgressMonitoring() {
  const navigate = useNavigate();

  // Sample data for bottleneck sections
  const bottleneckSections = [
    {
      name: 'Security Training',
      message: 'Completion rate below target (78%). Consider adding reminders or reviewing content difficulty.'
    },
    {
      name: 'Job Basics',
      message: 'Completion rate below target (65%). Consider adding reminders or reviewing content difficulty.'
    }
  ];

  // Sample data for last activity by department
  const departmentActivity = [
    { department: 'Engineering', lastActivity: '2 minutes ago', activeUsers: 24 },
    { department: 'Sales', lastActivity: '5 minutes ago', activeUsers: 18 },
    { department: 'Marketing', lastActivity: '1 hour ago', activeUsers: 12 },
    { department: 'Operation', lastActivity: '30 minutes ago', activeUsers: 15 }
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[#3E0288] text-3xl font-bold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Progress Monitoring
            </h1>
            <p className="text-[#3E0288] text-base font-medium opacity-70 mb-3" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Track training completion and identify areas needing attention.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#3E0288] transition text-sm"
            >
              <FiArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>
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
                U
              </button>
            </div>
            {/* Reports & Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold">
              <FiDownload size={16} />
              Reports & Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="px-6 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <HiUsers className="text-[#3E0288]" size={20} />
            </div>
          </div>
          <div className="text-[#3E0288] text-2xl font-bold mb-1">600</div>
          <div className="text-gray-600 text-xs">Total Employees</div>
        </div>

        {/* Active Learners */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <HiBookOpen className="text-[#3E0288]" size={20} />
            </div>
          </div>
          <div className="text-[#3E0288] text-2xl font-bold mb-1">400</div>
          <div className="text-gray-600 text-xs">Active Learners</div>
        </div>

        {/* Overall Completion Rate */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <AiOutlineRise className="text-[#3E0288]" size={20} />
            </div>
          </div>
          <div className="text-[#3E0288] text-2xl font-bold mb-1">74%</div>
          <div className="text-gray-600 text-xs">Overall Completion Rate</div>
        </div>

        {/* Pending Quizzes */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BsFileCheck className="text-[#3E0288]" size={20} />
            </div>
          </div>
          <div className="text-[#3E0288] text-2xl font-bold mb-1">250</div>
          <div className="text-gray-600 text-xs">Pending Quizzes</div>
        </div>
      </div>

      {/* Bottleneck Sections */}
      <div className="px-6 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h2 className="text-[#3E0288] text-xl font-bold mb-4">Bottleneck Sections</h2>
          <div className="space-y-4">
            {bottleneckSections.map((section, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
                <FiAlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{section.name}</h3>
                  <p className="text-xs text-gray-600">{section.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last Activity by Department */}
      <div className="px-6 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h2 className="text-[#3E0288] text-xl font-bold mb-4">Last Activity by Department</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Last Activity</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Active Users</th>
                </tr>
              </thead>
              <tbody>
                {departmentActivity.map((dept, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-white transition">
                    <td className="py-3 px-4 text-xs text-gray-700 font-medium">{dept.department}</td>
                    <td className="py-3 px-4 text-xs text-gray-600">{dept.lastActivity}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {dept.activeUsers}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

