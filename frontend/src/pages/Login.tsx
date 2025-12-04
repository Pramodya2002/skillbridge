import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const payload = { email, password };

        try {
            const res = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                const userRole = data.user.role;

                switch (userRole) {
                    case 'volunteer':
                        navigate('/volunteer/dashboard');
                        break;
                    case 'nonprofit':
                        navigate('/dashboard/nonprofit');
                        break;
                    case 'hr':
                        navigate('/dashboard/hr');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                const err = await res.json();
                setError(err.error || 'Invalid email or password');
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex flex-col">
            <Header />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-32 -left-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-10 -right-32 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20 relative z-10">
                <div className="w-full max-w-lg bg-white/75 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-10 md:p-16 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-12">
                            <h1 className="text-5xl md:text-6xl font-black text-teal-900 mb-4 leading-tight">
                                Welcome Back
                            </h1>
                            <p className="text-xl text-gray-700">Login to SkillBridge</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Email Field */}
                            <div className="relative">
                                <label className="block text-teal-800 font-semibold text-lg mb-2 pl-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full px-6 py-5 bg-white/70 backdrop-blur border border-gray-300/60 rounded-2xl text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 shadow-sm"
                                    placeholder="emma@gmail.com"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <label className="block text-teal-800 font-semibold text-lg mb-2 pl-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-6 py-5 bg-white/70 backdrop-blur border border-gray-300/60 rounded-2xl text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full py-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                Login to Dashboard
                                <i className="pi pi-arrow-right text-2xl"></i>
                            </button>

                            {/* Register Link */}
                            <p className="text-center text-gray-600 text-lg mt-8">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-teal-600 font-bold hover:underline">
                                    Register here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;