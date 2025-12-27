import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiDownload, FiBarChart2, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { HiUsers, HiBookOpen } from 'react-icons/hi';
import { AiOutlineRise } from 'react-icons/ai';
import { BsFileCheck } from 'react-icons/bs';

export default function Dashboard() {
    const { t } = useTranslation(['dashboard', 'common']);
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('19/11/2025');
    const [checkStatus, setCheckStatus] = useState('');
    const [filterSection, setFilterSection] = useState('');

    // Sample data for the bar chart
    const chartData = [
        { name: 'Vision', value: 55 },
        { name: 'Culture', value: 90 },
        { name: 'Rules', value: 60 },
        { name: 'Job Basics', value: 78 },
        { name: 'Tools', value: 40 }
    ];

    // Sample data for department progress
    const departmentData = [
        { id: '01', name: 'Engeneering', progress: 45 },
        { id: '02', name: 'Sales', progress: 29 },
        { id: '03', name: 'Marketing', progress: 18 },
        { id: '04', name: 'Operation', progress: 25 }
    ];

    // Sample data for recent active employees
    const employeeData = [
        { name: 'Ajay', section: 'Job basics', department: 'Engeneering', date: '12/12/2025', lastLogin: '1 hour ago', status: 'In Progress' },
        { name: 'Rahul', section: 'Vision', department: 'Sales', date: '15/12/2025', lastLogin: '2 min ago', status: 'Active' }
    ];

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Header Section */}
            <div className="bg-white px-6 py-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{t('dashboard:title')}</h1>
                        <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{t('dashboard:subtitle')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative w-64">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={t('common:search')}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                />
                            </div>
                            {/* Language Selector */}
                            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <span className="text-sm font-semibold">Eng (US)</span>
                                <span className="text-lg">🇺🇸</span>
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
                        <button 
                            onClick={() => navigate('/dashboard/reports')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
                        >
                            <FiDownload size={16} />
                            {t('dashboard:reportsExport')}
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
                    <div className="text-gray-600 text-xs">{t('dashboard:totalEmployees')}</div>
                </div>

                {/* Active Learners */}
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <HiBookOpen className="text-[#3E0288]" size={20} />
                        </div>
                    </div>
                    <div className="text-[#3E0288] text-2xl font-bold mb-1">400</div>
                    <div className="text-gray-600 text-xs">{t('dashboard:activeLearners')}</div>
                </div>

                {/* Overall Completion Rate */}
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <AiOutlineRise className="text-[#3E0288]" size={20} />
                        </div>
                    </div>
                    <div className="text-[#3E0288] text-2xl font-bold mb-1">74%</div>
                    <div className="text-gray-600 text-xs">{t('dashboard:overallCompletion')}</div>
                </div>

                {/* Pending Quizzes */}
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BsFileCheck className="text-[#3E0288]" size={20} />
                        </div>
                    </div>
                    <div className="text-[#3E0288] text-2xl font-bold mb-1">250</div>
                    <div className="text-gray-600 text-xs">{t('dashboard:pendingQuizzes')}</div>
                </div>
            </div>

            {/* Middle Section - Two Cards Side by Side */}
            <div className="px-6 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Training Completion by Section */}
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[#3E0288] text-lg font-semibold">{t('dashboard:trainingCompletion')}</h2>
                        <button 
                            onClick={() => navigate('/dashboard/viewanalytics')}
                            className="flex items-center gap-2 text-[#3E0288] text-xs font-semibold hover:opacity-80"
                        >
                            <span>{t('dashboard:viewAnalytics')}</span>
                            <FiBarChart2 size={14} />
                        </button>
                    </div>
                    {/* Bar Chart - Vertical Bars */}
                    <div className="flex items-end justify-between h-48 gap-3 mt-4">
                        {chartData.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex flex-col items-center justify-end h-full">
                                    <div
                                        className="w-full bg-[#3E0288] rounded-t-lg mb-2 transition-all hover:opacity-80"
                                        style={{ height: `${(item.value / 100) * 100}%`, minHeight: '20px' }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-600 mt-2 text-center">{item.name}</span>
                            </div>
                        ))}
                    </div>
                    {/* Y-axis labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                        <span>0</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                    </div>
                </div>

                {/* Progress by Department */}
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <h2 className="text-[#3E0288] text-lg font-semibold mb-4">{t('dashboard:progressByDepartment')}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">#</th>
                                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">{t('dashboard:departmentName')}</th>
                                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">{t('dashboard:progress')}</th>
                                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">{t('dashboard:inPercent')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departmentData.map((dept, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-3 px-2 text-xs text-gray-600">{dept.id}</td>
                                        <td className="py-3 px-2 text-xs text-gray-700 font-medium">{dept.name}</td>
                                        <td className="py-4 px-2">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-[#3E0288] h-2 rounded-full"
                                                    style={{ width: `${dept.progress}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className="inline-block px-3 py-1 bg-[#3E0288] text-white text-xs font-semibold rounded-full">
                                                {dept.progress}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Recent Active Employees */}
            <div className="px-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <h2 className="text-[#3E0288] text-lg font-semibold mb-4">{t('dashboard:recentActiveEmployees')}</h2>
                    
                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                        {/* Date Picker */}
                        <div className="relative flex items-center gap-2">
                            <FiCalendar className="text-gray-400" size={18} />
                            <input
                                type="text"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                            />
                        </div>
                        
                        {/* Check Status Dropdown */}
                        <div className="relative">
                            <select
                                value={checkStatus}
                                onChange={(e) => setCheckStatus(e.target.value)}
                                className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer"
                            >
                                <option value="">{t('dashboard:checkStatus')}</option>
                                <option value="active">{t('dashboard:active')}</option>
                                <option value="in-progress">{t('dashboard:inProgress')}</option>
                                <option value="completed">{t('dashboard:completed')}</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>

                        {/* Filter by Section Dropdown */}
                        <div className="relative">
                            <select
                                value={filterSection}
                                onChange={(e) => setFilterSection(e.target.value)}
                                className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer"
                            >
                                <option value="">{t('dashboard:filterBySection')}</option>
                                <option value="vision">Vision</option>
                                <option value="culture">Culture</option>
                                <option value="rules">Rules</option>
                                <option value="job-basics">Job Basics</option>
                                <option value="tools">Tools</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>

                        {/* Clear Filter Button */}
                        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            {t('dashboard:clearFilter')}
                        </button>
                    </div>

                    {/* Employee Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">{t('dashboard:employeeName')}</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">{t('dashboard:section')}</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">{t('dashboard:department')}</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">{t('common:date')}</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">{t('dashboard:lastLogin')}</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">{t('common:status')}</th>
                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">{t('dashboard:action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeData.map((employee, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-3 text-xs text-gray-700 font-medium">{employee.name}</td>
                                        <td className="py-3 px-3 text-xs text-gray-600">{employee.section}</td>
                                        <td className="py-3 px-3 text-xs text-gray-600">{employee.department}</td>
                                        <td className="py-3 px-3 text-xs text-gray-600">{employee.date}</td>
                                        <td className="py-3 px-3 text-xs text-gray-600">{employee.lastLogin}</td>
                                        <td className="py-3 px-3">
                                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                                employee.status === 'Active' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <button className="px-3 py-1 bg-[#3E0288] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition">
                                                {t('dashboard:sendReminder')}
                                            </button>
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
