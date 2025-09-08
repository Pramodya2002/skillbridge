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

                localStorage.setItem('user', JSON.stringify(data.user));

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
                setError(err.error || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, check backend connection.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-green-50">
            <Header />
            <main className="flex-1 flex justify-center items-center p-8">
                <div className="max-w-md w-full p-10 bg-white rounded-2xl shadow-xl text-center transition-shadow hover:shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-teal-700">Login to SkillBridge</h2>
                    <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-2 font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="p-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className="mb-2 font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="p-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 outline-none"
                            />
                        </div>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="p-3 bg-gradient-to-br from-teal-600 to-teal-700 text-white font-semibold rounded-lg text-lg hover:scale-105 hover:shadow-lg transition-transform"
                        >
                            Login
                        </button>
                        <p className="text-gray-600 text-sm mt-3 text-center">
                            Don't have an account? <Link to="/register" className="text-teal-600 font-semibold hover:underline">Register</Link>
                        </p>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
