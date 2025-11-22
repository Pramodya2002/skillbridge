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

        if (!name) newErrors.name = 'Name is required.';
        if (!email || !email.includes('@')) newErrors.email = 'Valid email is required.';
        if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            role: userType,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
        };

        try {
            const res = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.current?.show({
                    severity: "success",
                    summary: "Registration",
                    detail: "Registration completed successfully!",
                    life: 5000,
                    closable: true,
                    style: {
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        backgroundColor: '#10B981',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    },
                    icon: 'pi pi-check-circle'
                });

                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                setTimeout(() => navigate('/login'), 1500);

            } else {
                const errText = await res.text();
                alert('Error: ' + errText);
            }
        } catch (error) {
            console.error(error);
            alert('Network error, check backend connection.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-100 to-green-50">
            <Toast ref={toast} position="top-right" />
            <Header />
            <div className="max-w-2xl w-full mx-auto my-12 p-10 bg-white rounded-2xl shadow-lg flex-grow animate-fadeIn">
                <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">Register</h2>



                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Full Name</label>
                        <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500" value={formData.name} onChange={handleInputChange} required />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Email Address</label>
                        <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500" value={formData.email} onChange={handleInputChange} required />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Password</label>
                        <input type="password" id="password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500" value={formData.password} onChange={handleInputChange} required />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Confirm Password</label>
                        <input type="password" id="confirmPassword" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500" value={formData.confirmPassword} onChange={handleInputChange} required />
                        {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Select Role</label>
                        <select
                            id="role"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value as 'volunteer' | 'nonprofit' | 'hr')}
                            required
                        >
                            <option value="volunteer">Volunteer</option>
                            <option value="nonprofit">Nonprofit Admin</option>
                            <option value="hr">HR Manager</option>
                        </select>
                    </div>


                    <button type="submit" className="w-full mt-4 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 transform hover:-translate-y-1 transition-all">
                        Register
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
