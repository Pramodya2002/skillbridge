import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const [userType, setUserType] = useState<'volunteer' | 'nonprofit' | 'hr'>('volunteer');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const { name, email, password, confirmPassword } = formData;

        if (!name.trim()) newErrors.name = 'Full name is required';
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
        if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: userType,
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,
                }),
            });

            if (res.ok) {
                toast.current?.show({
                    severity: 'success',
                    life: 8000,
                    className: 'border-2 border-green-600 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl',
                    contentClassName: 'p-6 rounded-2xl',
                    style: {
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        backdropFilter: 'blur(12px)',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(20, 184, 166, 0.95))',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    },
                    summary: (
                        <div className="flex items-center gap-3 font-bold text-xl">
                            <i className="pi pi-check-circle text-3xl"></i>
                            Welcome to SkillBridge!
                        </div>
                    ),
                    detail: (
                        <span className="text-lg opacity-95">
                            Account created successfully. Redirecting to login...
                        </span>
                    ),
                });

                setTimeout(() => navigate('/login'), 2000);
            } else {
                const err = await res.json();

                toast.current?.show({
                    severity: 'error',
                    life: 6000,
                    className: 'border-2 border-red-600 bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-2xl',
                    contentClassName: 'p-6 rounded-2xl',
                    style: {
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        backdropFilter: 'blur(12px)',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(236, 72, 153, 0.95))',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    },
                    summary: (
                        <div className="flex items-center gap-3 font-bold text-xl">
                            <i className="pi pi-exclamation-triangle text-3xl"></i>
                            Registration Failed
                        </div>
                    ),
                    detail: (
                        <span className="text-lg block mt-2 opacity-95">
                            {err.message || 'Something went wrong. Please try again.'}
                        </span>
                    ),
                });
            }
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                life: 7000,
                className: 'border-2 border-orange-600 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-2xl',
                contentClassName: 'p-6 rounded-2xl',
                style: {
                    borderRadius: '18px',
                    fontSize: '1.1rem',
                    backdropFilter: 'blur(10px)',
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.95), rgba(239, 68, 68, 0.95))',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
                },
                summary: (
                    <div className="flex items-center gap-3 font-bold text-xl">
                        <i className="pi pi-wifi text-3xl animate-pulse"></i>
                        Connection Lost
                    </div>
                ),
                detail: (
                    <span className="text-lg block mt-2">
                        Please check your internet connection and try again.
                    </span>
                ),
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex flex-col">
            <Toast
                ref={toast}
                position="top-right"
                className="mt-20 mr-6 z-50"
            />
            <Header />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-10 -right-32 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20 relative z-10">
                <div className="w-full max-w-2xl bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-10 md:p-14 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <h1 className="text-5xl font-black text-teal-900 mb-4">Create Account</h1>
                            <p className="text-xl text-gray-700">Join thousands making a difference</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Full Name */}
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="peer w-full px-6 py-5 bg-white/60 backdrop-blur border border-gray-300/50 rounded-2xl text-gray-800 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 text-lg"
                                    placeholder="Full Name"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all duration-300 
                   peer-placeholder-shown:top-5 peer-placeholder-shown:text-lg 
                   peer-focus:-top-3 peer-focus:text-teal-600 peer-focus:text-sm 
                   peer-focus:bg-white peer-focus:px-2
                   peer-valid:-top-3 peer-valid:text-teal-600 peer-valid:text-sm peer-valid:bg-white peer-valid:px-2"
                                >
                                    Full Name
                                </label>
                                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="peer w-full px-6 py-5 bg-white/60 backdrop-blur border border-gray-300/50 rounded-2xl text-gray-800 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 text-lg"
                                    placeholder="Email Address"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all duration-300 
                   peer-placeholder-shown:top-5 peer-placeholder-shown:text-lg 
                   peer-focus:-top-3 peer-focus:text-teal-600 peer-focus:text-sm 
                   peer-focus:bg-white peer-focus:px-2
                   peer-valid:-top-3 peer-valid:text-teal-600 peer-valid:text-sm peer-valid:bg-white peer-valid:px-2"
                                >
                                    Email Address
                                </label>
                                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="peer w-full px-6 py-5 bg-white/60 backdrop-blur border border-gray-300/50 rounded-2xl text-gray-800 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 text-lg"
                                    placeholder="Password"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all duration-300 
                   peer-placeholder-shown:top-5 peer-placeholder-shown:text-lg 
                   peer-focus:-top-3 peer-focus:text-teal-600 peer-focus:text-sm 
                   peer-focus:bg-white peer-focus:px-2
                   peer-valid:-top-3 peer-valid:text-teal-600 peer-valid:text-sm peer-valid:bg-white peer-valid:px-2"
                                >
                                    Password
                                </label>
                                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="peer w-full px-6 py-5 bg-white/60 backdrop-blur border border-gray-300/50 rounded-2xl text-gray-800 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 text-lg"
                                    placeholder="Confirm Password"
                                />
                                <label
                                    htmlFor="confirmPassword"
                                    className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all duration-300 
                   peer-placeholder-shown:top-5 peer-placeholder-shown:text-lg 
                   peer-focus:-top-3 peer-focus:text-teal-600 peer-focus:text-sm 
                   peer-focus:bg-white peer-focus:px-2
                   peer-valid:-top-3 peer-valid:text-teal-600 peer-valid:text-sm peer-valid:bg-white peer-valid:px-2"
                                >
                                    Confirm Password
                                </label>
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
                            </div>

                            {/* Role Selection */}
                            <div className="relative">
                                <select
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value as any)}
                                    className="w-full px-6 py-5 bg-white/60 backdrop-blur border border-gray-300/50 rounded-2xl text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 appearance-none cursor-pointer"
                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundPosition: 'right 1.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
                                >
                                    <option value="volunteer">Volunteer</option>
                                    <option value="nonprofit">Nonprofit Admin</option>
                                    <option value="hr">HR Manager</option>
                                </select>
                                <label className="absolute left-6 -top-4 bg-white px-4 py-1 text-teal-700 text-xl font-extrabold tracking-wide">                                    I am a...
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="relative w-full py-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group/button flex items-center justify-center gap-3"
                            >
                                <span className="relative z-10">Create My Account</span>

                                <span className="absolute inset-0 bg-white/30 scale-0 group-hover/button:scale-150 transition-transform duration-700 rounded-full"></span>
                            </button>

                            <p className="text-center text-gray-600 mt-8">
                                Already have an account?{' '}
                                <a href="/login" className="text-teal-600 font-bold hover:underline">
                                    Log in here
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Register;