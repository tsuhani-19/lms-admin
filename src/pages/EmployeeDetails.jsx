import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiCalendar, FiMapPin, FiChevronDown } from 'react-icons/fi';

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Sample employee data
  const employee = {
    id: id || '1',
    name: 'Ajay smith',
    jobTitle: 'Senior Software Engineer',
    email: 'ajay122@gmail.com',
    startDate: '12/12/2025',
    department: 'Engineering',
    overallProgress: 75,
  };

  // Section progress data
  const sections = [
    { name: 'Company Vision & Mission', progress: 100, completed: 5, total: 5, status: 'completed' },
    { name: 'Company Culture & Values', progress: 100, completed: 5, total: 5, status: 'completed' },
    { name: 'Company Rules & Practice', progress: 30, completed: 2, total: 5, status: 'in-progress' },
    { name: 'Job Basics', progress: 0, completed: 0, total: 5, status: 'locked' },
    { name: 'Tools & Workflows', progress: 0, completed: 0, total: 5, status: 'locked' },
  ];

  // Quiz accuracy data
  const quizStats = [
    { section: 'Company Vision & Mission', accuracy: 100, attempts: 1 },
    { section: 'Company Culture & Values', accuracy: 90, attempts: 2 },
    { section: 'Company Rules & Practice', accuracy: 60, attempts: 4 },
    { section: 'Job Basics', accuracy: 'Locked', attempts: 0 },
    { section: 'Tools & Workflows', accuracy: 'Locked', attempts: 0 },
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[#3E0288] text-3xl font-bold mb-3" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Employee Details
            </h1>
            <button
              onClick={() => navigate('/users')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#3E0288] transition text-sm"
            >
              <FiArrowLeft size={16} />
              <span>Back to Users</span>
            </button>
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

      {/* Main Content */}
      {/* Full Width Employee Information and Overall Progress Card */}
      <div className="px-6 mb-6">
        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-6">
            {/* Profile Picture Placeholder - Left */}
            <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-bold text-gray-600">A</span>
            </div>

            {/* Middle Section - Name, Title, and Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{employee.name}</h2>
              <p className="text-gray-600 text-base mb-6">{employee.jobTitle}</p>

              {/* Employee Details - Horizontal */}
              <div className="flex flex-wrap items-start gap-46">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <FiMail className="text-gray-500" size={18} />
                    <span className="text-sm text-gray-500">Email</span>
                  </div>
                  <span className="text-sm text-gray-800 font-medium">{employee.email}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <FiCalendar className="text-gray-500" size={18} />
                    <span className="text-sm text-gray-500">Start Date</span>
                  </div>
                  <span className="text-sm text-gray-800 font-medium">{employee.startDate}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <FiMapPin className="text-gray-500" size={18} />
                    <span className="text-sm text-gray-500">Department</span>
                  </div>
                  <span className="text-sm text-gray-800 font-medium">{employee.department}</span>
                </div>
              </div>
            </div>

            {/* Overall Progress - Right */}
            <div className="flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Overall Progress</h2>
              <div className="w-48">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-[#3E0288] h-3 rounded-full transition-all"
                    style={{ width: `${employee.overallProgress}%` }}
                  ></div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{employee.overallProgress}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Bottom Cards */}
      <div className="px-6 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column - Bottom: Section-by-Section Progress */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
          <h2 className="text-[#3E0288] text-xl font-bold mb-6">Section-by-Section Progress</h2>
          <div className="space-y-5">
            {sections.map((section, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">{section.name}</span>
                  <span className="text-sm text-gray-600">{section.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      section.status === 'locked' ? 'bg-gray-300' : 'bg-[#3E0288]'
                    }`}
                    style={{ width: `${section.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {section.status === 'locked'
                    ? `${section.completed}/${section.total} Quiz Locked`
                    : `${section.completed}/${section.total} Quiz Completed`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Bottom: Quiz Accuracy Stats */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
          <h2 className="text-[#3E0288] text-xl font-bold mb-6">Quiz Accuracy Stats</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700">Section</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700">Accuracy</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700">Attempts</th>
                </tr>
              </thead>
              <tbody>
                {quizStats.map((stat, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-2 text-xs text-gray-700">{stat.section}</td>
                    <td className="py-3 px-2 text-xs text-gray-600">
                      {typeof stat.accuracy === 'number' ? `${stat.accuracy}%` : stat.accuracy}
                    </td>
                    <td className="py-3 px-2 text-xs text-gray-600">{stat.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-base font-semibold text-gray-800">Quiz Score</span>
            <span className="text-base font-semibold text-gray-600">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}

