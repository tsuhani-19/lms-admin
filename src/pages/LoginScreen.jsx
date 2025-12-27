import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminAPI from "../services/api";

export default function Login() {
    const { t } = useTranslation(['login', 'common']);
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showVerificationCode, setShowVerificationCode] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verifying, setVerifying] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Validate inputs
            if (!email || !password) {
                setError(t('login:emailRequired'));
                setLoading(false);
                return;
            }

            // Call login API
            const result = await AdminAPI.login(email, password);

            // If email verification is required, show verification code step
            if (result.requiresVerification) {
                setShowVerificationCode(true);
            } else {
                // If login successful with token (email already verified), navigate to dashboard
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message || t('login:loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError("");
        setVerifying(true);

        try {
            // Validate code
            if (!verificationCode || verificationCode.length < 4) {
                setError(t('login:codeRequired'));
                setVerifying(false);
                return;
            }

            // Verify the code
            await AdminAPI.verifyLoginCode(email, verificationCode);

            // Navigate to dashboard on success
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || t('login:codeInvalid'));
        } finally {
            setVerifying(false);
        }
    };

    const handleBackToLogin = () => {
        setShowVerificationCode(false);
        setVerificationCode("");
        setError("");
    };

    return (
        <div className="h-screen bg-[#3E0288] flex flex-col items-center justify-start overflow-hidden relative ">
            {/* Grid Pattern Background */}
            {/* <div 
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            /> */}

            {/* Header */}
            <div className="w-full text-center text-white flex-shrink-0 relative z-10 pb-10 pt-15">
                <h1 className="font-extrabold tracking-[-2px] leading-none" style={{ fontFamily: 'Jura, sans-serif', lineHeight: '0.9' }}>
                    <span className="text-[80px] md:text-[80px]">Learning</span>
                    <br />
                    <span className="text-[80px] md:text-[80px]">Journey Loop</span>
                </h1>
            </div>

            {/* White Login Container */}
            <div className="flex-1 w-full max-w-[1728px] bg-white rounded-tl-[140px] rounded-tr-[150px] px-6 md:px-12 lg:px-0 flex justify-center items-center relative z-10">
                <div className="w-full max-w-md py-8 md:py-12">

                    {!showVerificationCode ? (
                        <>
                            {/* Title */}
                            <h2 className="text-center text-[#3E0288] text-[36px] font-semibold mb-2" style={{ fontFamily: 'Jura, sans-serif' }}>
                                {t('login:title')}
                            </h2>
                            <p className="text-center text-[19px] text-[#3E0288] mb-8 md:mb-10">
                                {t('login:subtitle')}
                            </p>

                            {/* Form */}
                            <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">

                        {/* Email */}
                        <div>
                            <label className="block text-base text-gray-600 mb-1.5">{t('login:emailAddress')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-4 py-2.5 border border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-base text-gray-600">{t('login:password')}</label>
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 text-gray-600 text-sm hover:opacity-70"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? <FiEye /> : <FiEyeOff />}
                                    <span>{passwordVisible ? t('login:hide') : t('login:show')}</span>
                                </button>
                            </div>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-4 py-2.5 border border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                            />
                            <p className="text-xs text-gray-600 mt-1.5 opacity-70">
                                {t('login:passwordHint')}
                            </p>
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>

                        {/* Checkbox */}
                        <div className="pt-2">
                            <label className="flex items-start gap-2.5 text-sm text-[#3E0288] cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="mt-0.5 accent-[#3E0288] w-4 h-4 cursor-pointer" 
                                    required 
                                />
                                <span>
                                    {t('login:agreeTerms')}{" "}
                                    <a href="#" className="underline hover:opacity-80">{t('login:termsOfUse')}</a>
                                    {" "}{t('login:and')}{" "}
                                    <a href="#" className="underline hover:opacity-80">{t('login:privacyPolicy')}</a>
                                </span>
                            </label>
                        </div>

                            {/* Button */}
                            <div className="flex justify-center mt-6 md:mt-10">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-4/5 py-3 rounded-2xl bg-[#3E0288] text-white font hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                >
                                    {loading ? t('login:loggingIn') : t('login:logIn')}
                                </button>
                            </div>

                        </form>
                        </>
                    ) : (
                        <>
                            {/* Verification Code Title */}
                            <h2 className="text-center text-[#3E0288] text-[36px] font-semibold mb-2" style={{ fontFamily: 'Jura, sans-serif' }}>
                                {t('login:verificationTitle')}
                            </h2>
                            <p className="text-center text-[19px] text-[#3E0288] mb-8 md:mb-10">
                                {t('login:verificationSubtitle')}
                            </p>

                            {/* Verification Code Form */}
                            <form onSubmit={handleVerifyCode} className="space-y-5 md:space-y-6">
                                {/* Verification Code Input */}
                                <div>
                                    <label className="block text-base text-gray-600 mb-1.5">{t('login:verificationCode')}</label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        required
                                        disabled={verifying}
                                        placeholder={t('login:codePlaceholder')}
                                        className="w-full px-4 py-2.5 border border-[#3E0288] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 text-center text-2xl tracking-widest"
                                        maxLength={6}
                                        autoFocus
                                    />
                                    <p className="text-xs text-gray-600 mt-1.5 opacity-70 text-center">
                                        {t('login:codeHint')}
                                    </p>
                                    {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col gap-3 mt-6 md:mt-10">
                                    <button
                                        type="submit"
                                        disabled={verifying}
                                        className="w-full py-3 rounded-2xl bg-[#3E0288] text-white font hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                    >
                                        {verifying ? t('login:verifying') : t('login:verifyCode')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        disabled={verifying}
                                        className="w-full py-3 rounded-2xl border-2 border-[#3E0288] text-[#3E0288] font hover:bg-[#3E0288] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                    >
                                        {t('login:backToLogin')}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
