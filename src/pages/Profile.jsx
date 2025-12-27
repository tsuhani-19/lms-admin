import React, { useState, useEffect } from 'react';
import { FiEdit2, FiEye, FiEyeOff, FiChevronDown, FiShield, FiKey, FiUser, FiGlobe } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/config';
import AdminAPI from '../services/api';

export default function Profile() {
    const { t } = useTranslation(['profile', 'common']);
    const [isEditingName, setIsEditingName] = useState(false);
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');
    const [languagePreference, setLanguagePreference] = useState('English (US)');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordVisible, setPasswordVisible] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const languageDropdownRef = React.useRef(null);

    const languages = [
        { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
        { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
        { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
        { code: 'de-DE', name: 'German', flag: '🇩🇪' },
        { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
        { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' }
    ];

    useEffect(() => {
        // Load user data from localStorage or API
        const adminData = AdminAPI.getAdminData();
        const currentLanguage = i18n.language || 'en-US';
        const currentLangObj = languages.find(lang => lang.code === currentLanguage);
        
        if (adminData) {
            setFullName(adminData.name || adminData.fullName || '');
            setRole(adminData.role || 'Admin');
            setLanguagePreference(adminData.languagePreference || (currentLangObj?.name || 'English (US)'));
            setTwoFactorEnabled(adminData.twoFactorEnabled || false);
        } else {
            // Set language preference from i18n
            setLanguagePreference(currentLangObj?.name || 'English (US)');
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setShowLanguageDropdown(false);
            }
        };

        if (showLanguageDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLanguageDropdown]);

    const handleSaveName = async () => {
        if (!fullName.trim()) {
            return;
        }
        setLoading(true);
        try {
            // TODO: API call to update name
            // await AdminAPI.updateProfile({ fullName });
            setIsEditingName(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating name:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const errors = {};

        // Validation
        if (!passwordData.currentPassword) {
            errors.currentPassword = t('profile:passwordRequired');
        }
        if (!passwordData.newPassword) {
            errors.newPassword = t('profile:newPasswordRequired');
        } else if (passwordData.newPassword.length < 8) {
            errors.newPassword = t('profile:passwordMinLength');
        }
        if (!passwordData.confirmPassword) {
            errors.confirmPassword = t('profile:confirmPasswordRequired');
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = t('profile:passwordsDoNotMatch');
        }

        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }

        setLoading(true);
        setPasswordErrors({});
        try {
            // TODO: API call to change password
            // await AdminAPI.changePassword({
            //     currentPassword: passwordData.currentPassword,
            //     newPassword: passwordData.newPassword
            // });
            
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordForm(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            setPasswordErrors({ submit: error.message || t('profile:passwordChangeFailed') });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle2FA = async () => {
        setLoading(true);
        try {
            // TODO: API call to toggle 2FA
            // await AdminAPI.toggle2FA(!twoFactorEnabled);
            setTwoFactorEnabled(!twoFactorEnabled);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Error toggling 2FA:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = async (language) => {
        setLanguagePreference(language.name);
        setShowLanguageDropdown(false);
        setLoading(true);
        try {
            // Change i18n language
            await i18n.changeLanguage(language.code);
            // Save to localStorage
            localStorage.setItem('i18nextLng', language.code);
            // TODO: API call to update language preference
            // await AdminAPI.updateProfile({ languagePreference: language.code });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating language:', error);
        } finally {
            setLoading(false);
        }
    };

    const ToggleSwitch = ({ checked, onChange, id }) => {
        return (
            <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                    disabled={loading}
                />
                <div className={`w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#3E0288] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3E0288] disabled:opacity-50`}></div>
            </label>
        );
    };

    const selectedLanguage = languages.find(lang => lang.name === languagePreference) || languages[0];

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Header Section */}
            <div className="bg-white px-6 py-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                            {t('profile:title')}
                        </h1>
                        <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                            {t('profile:subtitle')}
                        </p>
                    </div>
                    {saveSuccess && (
                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                            {t('common:success')}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 space-y-6 pb-6">
                {/* Personal Information Section */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-[#3E0288] text-xl font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                                <FiUser className="text-[#3E0288]" size={20} />
                                {t('profile:personalInformation')}
                            </h2>
                            <p className="text-gray-600 text-sm">{t('profile:personalInfoDesc')}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Full Name */}
                        <div className="py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <label className="text-gray-700 font-medium text-sm mb-2 block">
                                        {t('profile:fullName')}
                                    </label>
                                    {isEditingName ? (
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="flex-1 px-4 py-2 border-2 border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                                placeholder={t('profile:enterFullName')}
                                                disabled={loading}
                                            />
                                            <button
                                                onClick={handleSaveName}
                                                disabled={loading || !fullName.trim()}
                                                className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? t('common:loading') : t('common:save')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditingName(false);
                                                    const adminData = AdminAPI.getAdminData();
                                                    setFullName(adminData?.name || adminData?.fullName || '');
                                                }}
                                                disabled={loading}
                                                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold disabled:opacity-50"
                                            >
                                                {t('common:cancel')}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700 text-base">{fullName || t('profile:notSet')}</span>
                                            <button
                                                onClick={() => setIsEditingName(true)}
                                                className="flex items-center gap-2 px-4 py-2 text-[#3E0288] border-2 border-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold"
                                            >
                                                <FiEdit2 size={16} />
                                                {t('common:edit')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="py-3">
                            <label className="text-gray-700 font-medium text-sm mb-2 block">
                                {t('profile:role')}
                            </label>
                            <div className="flex items-center gap-3">
                                <span className="inline-block px-4 py-2 bg-[#3E0288] text-white text-sm font-semibold rounded-lg">
                                    {role || 'Admin'}
                                </span>
                                <span className="text-gray-600 text-sm">{t('profile:roleAssigned')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Language Preference Section */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-[#3E0288] text-xl font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                            <FiGlobe className="text-[#3E0288]" size={20} />
                            {t('profile:languagePreference')}
                        </h2>
                        <p className="text-gray-600 text-sm">{t('profile:languageDesc')}</p>
                    </div>

                    <div className="py-3">
                        <div className="relative" ref={languageDropdownRef}>
                            <button
                                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                className="w-full md:w-80 flex items-center justify-between px-4 py-3 border-2 border-[#3E0288] rounded-lg bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{selectedLanguage.flag}</span>
                                    <span>{selectedLanguage.name}</span>
                                </div>
                                <FiChevronDown className={`text-[#3E0288] transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} size={16} />
                            </button>
                            {showLanguageDropdown && (
                                <div className="absolute z-10 w-full md:w-80 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                    {languages.map((language) => (
                                        <button
                                            key={language.code}
                                            onClick={() => handleLanguageChange(language)}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-3 ${
                                                languagePreference === language.name ? 'bg-purple-50 text-[#3E0288] font-semibold' : 'text-gray-700'
                                            }`}
                                        >
                                            <span className="text-xl">{language.flag}</span>
                                            <span>{language.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Change Password Section */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-[#3E0288] text-xl font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                                <FiKey className="text-[#3E0288]" size={20} />
                                {t('profile:changePassword')}
                            </h2>
                            <p className="text-gray-600 text-sm">{t('profile:passwordDesc')}</p>
                        </div>
                        {!showPasswordForm && (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
                            >
                                <FiEdit2 size={16} />
                                {t('profile:changePassword')}
                            </button>
                        )}
                    </div>

                    {showPasswordForm && (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="block text-gray-700 font-medium text-sm mb-2">
                                    {t('profile:currentPassword')}
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible.current ? "text" : "password"}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm pr-10 ${
                                            passwordErrors.currentPassword ? 'border-red-500' : 'border-[#3E0288]'
                                        }`}
                                        placeholder={t('profile:enterCurrentPassword')}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible({ ...passwordVisible, current: !passwordVisible.current })}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {passwordVisible.current ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {passwordErrors.currentPassword && (
                                    <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-gray-700 font-medium text-sm mb-2">
                                    {t('profile:newPassword')}
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible.new ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm pr-10 ${
                                            passwordErrors.newPassword ? 'border-red-500' : 'border-[#3E0288]'
                                        }`}
                                        placeholder={t('profile:enterNewPassword')}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible({ ...passwordVisible, new: !passwordVisible.new })}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {passwordVisible.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && (
                                    <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                                )}
                                <p className="text-xs text-gray-600 mt-1.5">
                                    {t('profile:passwordHint')}
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-gray-700 font-medium text-sm mb-2">
                                    {t('profile:confirmPassword')}
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible.confirm ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm pr-10 ${
                                            passwordErrors.confirmPassword ? 'border-red-500' : 'border-[#3E0288]'
                                        }`}
                                        placeholder={t('profile:confirmNewPassword')}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible({ ...passwordVisible, confirm: !passwordVisible.confirm })}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {passwordVisible.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {passwordErrors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                                )}
                            </div>

                            {passwordErrors.submit && (
                                <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm">
                                    {passwordErrors.submit}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                        setPasswordErrors({});
                                    }}
                                    disabled={loading}
                                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold disabled:opacity-50"
                                >
                                    {t('common:cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? t('profile:changing') : t('profile:changePassword')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Two-Factor Authentication Section */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-[#3E0288] text-xl font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                            <FiShield className="text-[#3E0288]" size={20} />
                            {t('profile:twoFactorAuth')}
                        </h2>
                        <p className="text-gray-600 text-sm">{t('profile:twoFactorDesc')}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                            <div className="flex-1">
                                <p className="text-gray-700 font-medium text-sm mb-1">
                                    {t('profile:enable2FA')}
                                </p>
                                <p className="text-gray-600 text-xs">
                                    {twoFactorEnabled 
                                        ? t('profile:twoFactorEnabled')
                                        : t('profile:twoFactorDisabled')}
                                </p>
                            </div>
                            <ToggleSwitch
                                checked={twoFactorEnabled}
                                onChange={handleToggle2FA}
                                id="two-factor-auth"
                            />
                        </div>

                        {twoFactorEnabled && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <p className="text-[#3E0288] text-sm font-semibold mb-2">{t('profile:twoFactorActive')}</p>
                                <p className="text-gray-700 text-xs">
                                    {t('profile:twoFactorActiveDesc')}
                                </p>
                            </div>
                        )}

                        {!twoFactorEnabled && (
                            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                                <p className="text-gray-700 text-sm font-semibold mb-2">{t('profile:twoFactorInactive')}</p>
                                <p className="text-gray-600 text-xs">
                                    {t('profile:twoFactorInactiveDesc')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

