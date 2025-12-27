import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiDownload, FiChevronDown, FiArrowLeft, FiFilter } from 'react-icons/fi';
import { HiUsers, HiBookOpen } from 'react-icons/hi';
import { AiOutlineRise } from 'react-icons/ai';

export default function ReportsExport() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('Completion Report');
  const [department, setDepartment] = useState('Sales');
  const [role, setRole] = useState('Manager');

  // Sample data for the table
  const employeeData = [
    { name: 'Ajay', email: 'ajay122@gmail.com', department: 'Sales', role: 'Manager', section: '5', status: 'Completed', quizScore: '92%' },
    { name: 'Rahul', email: 'rahul@gmail.com', department: 'Sales', role: 'Manager', section: '5', status: 'Completed', quizScore: '80%' },
    { name: 'Jeeshan', email: 'jeeshanbusi@gmail.com', department: 'Sales', role: 'Manager', section: '5', status: 'Completed', quizScore: '95%' },
    { name: 'Divekar', email: 'divekar123@gmail.com', department: 'Sales', role: 'Manager', section: '5', status: 'Completed', quizScore: '85%' },
    { name: 'Omkar', email: 'om123@gmail.com', department: 'Sales', role: 'Manager', section: '5', status: 'Completed', quizScore: '83%' },
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Reports & Export
            </h1>
            <p className="text-[#3E0288] text-base font-medium opacity-70 mb-3" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Download employee and training data for analysis
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#3E0288] transition text-sm"
            >
              <FiArrowLeft size={16} />
              <span>Back</span>
            </button>
          </div>
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
            <div className="w-10 h-10 rounded-full bg-[#3E0288] flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </div>
      </div>

      {/* Export User Data Section */}
      <div className="px-6 mb-6">
        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-[#3E0288] text-xl font-bold mb-2">Export User Data</h2>
              <p className="text-sm text-gray-600 mb-4">Download a complete list of all employees with their details</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Name, Email, Section</li>
                <li>• Role, Department,</li>
                <li>• Status, Last Login</li>
              </ul>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold">
                <FiDownload size={16} />
                Export CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold">
                <FiDownload size={16} />
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Report Type Dropdown */}
          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer min-w-[180px]"
            >
              <option value="Completion Report">Completion Report</option>
              <option value="Quiz Report">Quiz Report</option>
              <option value="Progress Report">Progress Report</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer min-w-[150px]"
            >
              <option value="Sales">Sales</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Operation">Operation</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer min-w-[150px]"
            >
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Acc manager">Acc manager</option>
              <option value="Marketing">Marketing</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          {/* Export CSV Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold ml-auto">
            <FiDownload size={16} />
            Export CSV
          </button>
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

        {/* Average Quiz Score */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <HiBookOpen className="text-[#3E0288]" size={20} />
            </div>
          </div>
          <div className="text-[#3E0288] text-2xl font-bold mb-1">85%</div>
          <div className="text-gray-600 text-xs">Average Quiz Score</div>
        </div>

        {/* Average Completion Rate */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <AiOutlineRise className="text-[#3E0288]" size={20} />
            </div>
          </div>
          <div className="text-[#3E0288] text-2xl font-bold mb-1">74%</div>
          <div className="text-gray-600 text-xs">Average Completion Rate</div>
        </div>

        {/* Pass Rate */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <AiOutlineRise className="text-[#3E0288]" size={20} />
            </div>
          </div>
          <div className="text-[#3E0288] text-2xl font-bold mb-1">90%</div>
          <div className="text-gray-600 text-xs">Pass Rate</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Section</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Quiz Score</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((employee, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-white transition">
                    <td className="py-3 px-4 text-xs text-gray-700 font-medium">{employee.name}</td>
                    <td className="py-3 px-4 text-xs text-gray-600">{employee.email}</td>
                    <td className="py-3 px-4 text-xs text-gray-600">{employee.department}</td>
                    <td className="py-3 px-4 text-xs text-gray-600">{employee.role}</td>
                    <td className="py-3 px-4 text-xs text-gray-600">{employee.section}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700 font-medium">{employee.quizScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Guidelines */}
      <div className="px-6 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h2 className="text-[#3E0288] text-xl font-bold mb-4">Export Guidelines</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Exports include data based on current filters and permissions</li>
            <li>• Large exports may take a few moments to process</li>
            <li>• All data is exported in UTF-8 encoding for compatibility</li>
            <li>• Excel exports support up to 100,000 rows</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

