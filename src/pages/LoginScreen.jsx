import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminAPI from "../services/api";

export default function Login() {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Validate inputs
            if (!email || !password) {
                setError("Email and password are required");
                setLoading(false);
                return;
            }

            // Call API
            await AdminAPI.login(email, password);

            // Navigate to dashboard on success
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#3E0288] flex flex-col items-center justify-start overflow-hidden">

            {/* Header */}
            <div className="w-full text-center pt-8 md:pt-14 text-white flex-shrink-0">
                <h1 className="font-semibold text-[28px] md:text-[36px] tracking-[-2px] leading-tight">
                    Learning
                    <br />
                    Journey Loop
                </h1>
            </div>

            {/* White Login Container */}
            <div className="flex-1 w-full max-w-[1728px] bg-white rounded-tl-[200px] rounded-tr-[200px] px-6 md:px-12 lg:px-0 flex justify-center items-center">
                <div className="w-full max-w-md">

                    {/* Title */}
                    <h2 className="text-center text-[#3E0288] text-xl md:text-2xl font-semibold">
                        Login
                    </h2>
                    <p className="text-center text-sm text-[#3E0288] mt-2">
                        Log in to manage onboarding, training content, and employee progress.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="mt-6 md:mt-8 space-y-4 md:space-y-6">

                        {/* Email */}
                        <div>
                            <label className="text-xs text-gray-600">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full mt-1 px-3 py-2 border border-[#3E0288] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3E0288] disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="text-xs text-gray-600">Password</label>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full mt-1 px-3 py-2 pr-10 border border-[#3E0288] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3E0288] disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-600"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? <FiEye /> : <FiEyeOff />}
                            </button>
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>


                        {/* Checkboxes */}
                        <div className="space-y-1 text-xs text-[#3E0288]">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="accent-[#3E0288]" required />
                                Agree to our Terms of use and Privacy Policy
                            </label>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-2 md:mt-6 rounded-full bg-gradient-to-r from-[#4B00A8] to-[#2E0066] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
