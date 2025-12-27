import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMoreVertical, FiSearch, FiFilter, FiChevronDown, FiPlus, FiUpload } from "react-icons/fi";

export default function UserManagement() {
  const { t } = useTranslation(['users', 'common']);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample data matching the image
  const employees = [
    { id: 1, name: "Ajay", email: "ajay122@gmail.com", department: "Engeneering", role: "Developer", lastLogin: "1 hour ago", status: "In Progress" },
    { id: 2, name: "Rahul", email: "rahul@gmail.com", department: "Sales", role: "Acc manager", lastLogin: "2 min ago", status: "Active" },
    { id: 3, name: "Jeeshan", email: "jeeshanbusi@gmail.com", department: "Marketing", role: "Manager", lastLogin: "October", status: "In Active" },
    { id: 4, name: "Divekar", email: "divekar123@gmail.com", department: "Operation", role: "Developer", lastLogin: "3 hour ago", status: "In Progress" },
    { id: 5, name: "Omkar", email: "om123@gmail.com", department: "Sales", role: "Marketing", lastLogin: "Yesterday", status: "Completed" },
    { id: 6, name: "Ajay", email: "ajay122@gmail.com", department: "Engeneering", role: "Developer", lastLogin: "1 hour ago", status: "In Progress" },
    { id: 7, name: "Rahul", email: "rahul@gmail.com", department: "Sales", role: "Acc manager", lastLogin: "2 min ago", status: "Active" },
    { id: 8, name: "Jeeshan", email: "jeeshanbusi@gmail.com", department: "Marketing", role: "Manager", lastLogin: "October", status: "In Active" },
  ];

  const totalEmployees = 600;

  const statusColors = {
    "Active": "bg-green-100 text-green-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    "In Active": "bg-red-100 text-red-700",
    "Completed": "bg-purple-100 text-purple-700",
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = !searchTerm || 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || emp.department === departmentFilter;
    const matchesRole = !roleFilter || emp.role === roleFilter;
    const matchesStatus = !statusFilter || emp.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(totalEmployees / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              {t('users:title')}
            </h1>
            <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              {t('users:subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
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

      {/* Search and Filter Bar */}
      <div className="px-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer min-w-[150px]"
            >
              <option value="">Department</option>
              <option value="Engeneering">Engeneering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Operation">Operation</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer min-w-[150px]"
            >
              <option value="">Role</option>
              <option value="Developer">Developer</option>
              <option value="Acc manager">Acc manager</option>
              <option value="Manager">Manager</option>
              <option value="Marketing">Marketing</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer min-w-[150px]"
            >
              <option value="">Check status</option>
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="In Active">In Active</option>
              <option value="Completed">Completed</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold">
              <FiPlus size={16} />
              Add Employee
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold">
              <FiUpload size={16} />
              Upload CSV
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="px-6 mb-6">
        <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Department</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Role</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Last Login</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="border-b border-gray-100 hover:bg-white transition cursor-pointer"
                    onClick={() => navigate(`/users/${employee.id}`)}
                  >
                    <td className="py-4 px-4 text-sm text-gray-700 font-medium">{employee.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{employee.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{employee.department}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{employee.role}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{employee.lastLogin}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColors[employee.status]}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="text-gray-400 hover:text-[#3E0288] transition"
                        onClick={() => navigate(`/users/${employee.id}`)}
                      >
                        <FiMoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            Showing {displayedEmployees.length} of {totalEmployees} employees
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentPage === page
                    ? "bg-[#3E0288] text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
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
    </div>
  );
}
