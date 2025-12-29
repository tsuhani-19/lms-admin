import React, { useState } from 'react';
import { FiEdit2, FiMapPin, FiPhone, FiMail, FiGlobe, FiFileText, FiCalendar, FiBriefcase, FiInfo } from 'react-icons/fi';
import { HiOfficeBuilding } from 'react-icons/hi';

export default function CompanyDetails() {
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [companyData, setCompanyData] = useState({
        companyName: 'Activa Learning Solutions',
        address: '123 Business Park, Suite 100',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        email: 'contact@activa.com',
        website: 'www.activa.com',
        taxId: 'TAX-123456789',
        registrationNumber: 'REG-987654321',
        foundedDate: '2020-01-15',
        industry: 'Education Technology',
        description: 'Leading provider of learning management systems and corporate training solutions.',
        employeeCount: '50-100',
        annualRevenue: '$5M - $10M'
    });

    const [editData, setEditData] = useState({ ...companyData });

    const handleEdit = () => {
        setEditData({ ...companyData });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditData({ ...companyData });
        setIsEditing(false);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setCompanyData({ ...editData });
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving company details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Header Section */}
            <div className="bg-white px-6 py-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                            Company Details
                        </h1>
                        <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                            View and manage your company information
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {saveSuccess && (
                            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                                Company details updated successfully
                            </div>
                        )}
                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
                            >
                                <FiEdit2 size={16} />
                                Edit Details
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 space-y-6 pb-6">
                {/* Basic Information Section */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-[#3E0288] text-xl font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                                <HiOfficeBuilding className="text-[#3E0288]" size={20} />
                                Basic Information
                            </h2>
                            <p className="text-gray-600 text-sm">Company name and identification details</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Company Name */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block">
                                Company Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="Enter company name"
                                />
                            ) : (
                                <span className="text-gray-700 text-base font-medium">{companyData.companyName}</span>
                            )}
                        </div>

                        {/* Tax ID */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block flex items-center gap-2">
                                <FiFileText size={16} />
                                Tax ID / EIN
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.taxId}
                                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="Enter tax ID"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.taxId}</span>
                            )}
                        </div>

                        {/* Registration Number */}
                        <div className="py-3">
                            <label className="text-gray-700 font-medium text-sm mb-2 block flex items-center gap-2">
                                <FiFileText size={16} />
                                Registration Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.registrationNumber}
                                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="Enter registration number"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.registrationNumber}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-[#3E0288] text-xl font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                            <FiMapPin className="text-[#3E0288]" size={20} />
                            Contact Information
                        </h2>
                        <p className="text-gray-600 text-sm">Company address and contact details</p>
                    </div>

                    <div className="space-y-6">
                        {/* Address */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block">
                                Street Address
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="Enter street address"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.address}</span>
                            )}
                        </div>

                        {/* City, State, Zip */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-200">
                            <div>
                                <label className="text-gray-700 font-medium text-sm mb-2 block">
                                    City
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                        placeholder="City"
                                    />
                                ) : (
                                    <span className="text-gray-700 text-base">{companyData.city}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-gray-700 font-medium text-sm mb-2 block">
                                    State / Province
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                        placeholder="State"
                                    />
                                ) : (
                                    <span className="text-gray-700 text-base">{companyData.state}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-gray-700 font-medium text-sm mb-2 block">
                                    ZIP / Postal Code
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.zipCode}
                                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                        placeholder="ZIP Code"
                                    />
                                ) : (
                                    <span className="text-gray-700 text-base">{companyData.zipCode}</span>
                                )}
                            </div>
                        </div>

                        {/* Country */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block">
                                Country
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="Enter country"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.country}</span>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block flex items-center gap-2">
                                <FiPhone size={16} />
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.phone}</span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block flex items-center gap-2">
                                <FiMail size={16} />
                                Email Address
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="Enter email address"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.email}</span>
                            )}
                        </div>

                        {/* Website */}
                        <div className="py-3">
                            <label className="text-gray-700 font-medium text-sm mb-2 block flex items-center gap-2">
                                <FiGlobe size={16} />
                                Website
                            </label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={editData.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="Enter website URL"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.website}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Company Details Section */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-[#3E0288] text-xl font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                            <FiBriefcase className="text-[#3E0288]" size={20} />
                            Company Details
                        </h2>
                        <p className="text-gray-600 text-sm">Additional company information</p>
                    </div>

                    <div className="space-y-6">
                        {/* Founded Date */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block flex items-center gap-2">
                                <FiCalendar size={16} />
                                Founded Date
                            </label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editData.foundedDate}
                                    onChange={(e) => handleInputChange('foundedDate', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{new Date(companyData.foundedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            )}
                        </div>

                        {/* Industry */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block flex items-center gap-2">
                                <FiBriefcase size={16} />
                                Industry
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.industry}
                                    onChange={(e) => handleInputChange('industry', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="Enter industry"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.industry}</span>
                            )}
                        </div>

                        {/* Employee Count */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block">
                                Employee Count
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.employeeCount}
                                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="e.g., 50-100"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.employeeCount}</span>
                            )}
                        </div>

                        {/* Annual Revenue */}
                        <div className="py-3 border-b border-gray-200">
                            <label className="text-gray-700 font-medium text-sm mb-2 block">
                                Annual Revenue
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.annualRevenue}
                                    onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                    placeholder="e.g., $5M - $10M"
                                />
                            ) : (
                                <span className="text-gray-700 text-base">{companyData.annualRevenue}</span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="py-3">
                            <label className="text-gray-700 font-medium text-sm mb-2 block flex items-center gap-2">
                                <FiInfo size={16} />
                                Company Description
                            </label>
                            {isEditing ? (
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm min-h-[100px] resize-y"
                                    placeholder="Enter company description"
                                />
                            ) : (
                                <p className="text-gray-700 text-base">{companyData.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons (when editing) */}
                {isEditing && (
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

