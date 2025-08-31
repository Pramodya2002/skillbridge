import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import type { MultiValue } from 'react-select';
import { Toast } from 'primereact/toast';



type OptionType = { value: string; label: string };


const skillOptions: OptionType[] = [
    { value: 'graphic-design', label: 'Graphic Design' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'content-writing', label: 'Content Writing' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'marketing', label: 'Marketing' }
];

const causeOptions: OptionType[] = [
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'environment', label: 'Environment' },
    { value: 'animal-welfare', label: 'Animal Welfare' },
    { value: 'youth', label: 'Youth Empowerment' }
];

const Register: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const queryParams = new URLSearchParams(location.search);
    const roleFromQuery = queryParams.get('role') as 'volunteer' | 'nonprofit' | 'hr';

    const [userType, setUserType] = useState<'volunteer' | 'nonprofit' | 'hr'>('volunteer');
    const [selectedSkills, setSelectedSkills] = useState<MultiValue<OptionType>>([]);
    const [selectedCauses, setSelectedCauses] = useState<MultiValue<OptionType>>([]);
    const [formData, setFormData] = useState({
        volunteer: { name: '', email: '', password: '', confirmPassword: '' },
        nonprofit: { name: '', email: '', password: '', confirmPassword: '' },
        hr: { name: '', email: '', password: '', confirmPassword: '', employeeCount: '' }
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (roleFromQuery) setUserType(roleFromQuery);
    }, [roleFromQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [userType]: { ...prev[userType], [id]: value } }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const { name, email, password, confirmPassword } = formData[userType];

        if (!name) newErrors.name = 'Name is required.';
        if (!email || !email.includes('@')) newErrors.email = 'Valid email is required.';
        if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

        if (userType === 'hr') {
            const count = parseInt(formData.hr.employeeCount || '0', 10);
            if (isNaN(count) || count < 0) newErrors.employeeCount = 'Employee count must be non-negative.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        let payload: any = {
            role: userType,
            name: formData[userType].name,
            email: formData[userType].email,
            password: formData[userType].password,
            password_confirmation: formData[userType].confirmPassword,
        };

        if (userType === 'volunteer') {
            payload.skills = selectedSkills.map(s => s.value);
            payload.causes = selectedCauses.map(c => c.value);
            payload.availability = (document.getElementById('availability') as HTMLSelectElement)?.value;
            payload.experience_level = (document.getElementById('experience') as HTMLSelectElement)?.value;
            payload.portfolio = (document.getElementById('portfolio') as HTMLInputElement)?.value;
        }

        if (userType === 'nonprofit') {
            payload.orgName = (document.getElementById('orgName') as HTMLInputElement)?.value;
            payload.mission = (document.getElementById('mission') as HTMLTextAreaElement)?.value;
            payload.focusAreas = (document.getElementById('focusAreas') as HTMLSelectElement)?.value;
            payload.website = (document.getElementById('website') as HTMLInputElement)?.value;
            payload.contactName = (document.getElementById('contactName') as HTMLInputElement)?.value;
            payload.contactEmail = (document.getElementById('contactEmail') as HTMLInputElement)?.value;
        }

        if (userType === 'hr') {
            payload.company = (document.getElementById('company') as HTMLInputElement)?.value;
            payload.department = (document.getElementById('department') as HTMLSelectElement)?.value;
            payload.position = (document.getElementById('position') as HTMLSelectElement)?.value;
            payload.companyWebsite = (document.getElementById('companyWebsite') as HTMLInputElement)?.value;
            payload.employeeCount = formData.hr.employeeCount;
        }

        try {
            const res = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Registration completed successfully!',
                    life: 3000,
                    closable: true,
                    style: { backgroundColor: '#1abc9c', color: '#fff', fontSize: '16px', borderRadius: '8px' }
                });

                setFormData({
                    volunteer: { name: '', email: '', password: '', confirmPassword: '' },
                    nonprofit: { name: '', email: '', password: '', confirmPassword: '' },
                    hr: { name: '', email: '', password: '', confirmPassword: '', employeeCount: '' }
                });

                setSelectedSkills([]);
                setSelectedCauses([]);

                setErrors({});

                const plainFields = ['availability', 'experience', 'portfolio', 'orgName', 'mission', 'focusAreas', 'website', 'contactName', 'contactEmail', 'company', 'department', 'position', 'companyWebsite'];
                plainFields.forEach(id => {
                    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
                    if (el) el.value = '';
                });

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

    const renderFormFields = () => {
        const baseInputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500";
        const baseErrorClasses = "text-red-600 text-sm mt-1";

        switch (userType) {
            case 'volunteer':
                return (
                    <>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Your Skills</label>
                            <Select isMulti options={skillOptions} value={selectedSkills} onChange={setSelectedSkills} classNamePrefix="react-select" placeholder="Select your skills" />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Availability</label>
                            <select id="availability" className={baseInputClasses}>
                                <option value="">Select availability</option>
                                <option value="weekdays">Weekdays</option>
                                <option value="weekends">Weekends</option>
                                <option value="10-hours">10 hrs/week</option>
                                <option value="20-hours">20 hrs/week</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Cause Interests</label>
                            <Select isMulti options={causeOptions} value={selectedCauses} onChange={setSelectedCauses} classNamePrefix="react-select" placeholder="Select causes" />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Experience Level</label>
                            <select id="experience" className={baseInputClasses}>
                                <option value="">Select your level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Portfolio or LinkedIn (Optional)</label>
                            <input type="url" id="portfolio" className={baseInputClasses} placeholder="https://yourportfolio.com" />
                        </div>
                    </>
                );
            case 'nonprofit':
                return (
                    <>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Organization Name</label>
                            <input type="text" id="orgName" className={baseInputClasses} placeholder="Enter organization name" />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Mission Statement</label>
                            <textarea id="mission" className={baseInputClasses} placeholder="Describe your mission" />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Cause Focus Areas</label>
                            <select id="focusAreas" className={baseInputClasses}>
                                <option value="">Select a cause</option>
                                <option value="education">Education</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="environment">Environment</option>
                                <option value="human-rights">Human Rights</option>
                                <option value="arts">Arts & Culture</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Organization Website</label>
                            <input type="url" id="website" className={baseInputClasses} placeholder="https://yourorg.org" />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Contact Person Name</label>
                            <input type="text" id="contactName" className={baseInputClasses} placeholder="Full name of contact person" />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Contact Person Email</label>
                            <input type="email" id="contactEmail" className={baseInputClasses} placeholder="contact@yourorg.org" />
                        </div>
                    </>
                );
            case 'hr':
                return (
                    <>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Company Name</label>
                            <input type="text" id="company" className={baseInputClasses} placeholder="Enter company name" />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Department</label>
                            <select id="department" className={baseInputClasses}>
                                <option value="">Select department</option>
                                <option value="csr">CSR</option>
                                <option value="hr">HR</option>
                                <option value="lnd">Learning & Development</option>
                                <option value="talent">Talent Management</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Position / Title</label>
                            <select id="position" className={baseInputClasses}>
                                <option value="">Select position</option>
                                <option value="csr-manager">CSR Manager</option>
                                <option value="hr-director">HR Director</option>
                                <option value="talent-lead">Talent Development Lead</option>
                                <option value="training-specialist">Training Specialist</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Company Website</label>
                            <input type="url" id="companyWebsite" className={baseInputClasses} placeholder="https://yourcompany.com" />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold mb-1 block">Approx. No. of Volunteers to Onboard</label>
                            <input type="number" id="employeeCount" className={baseInputClasses} min="0" value={formData.hr.employeeCount} onChange={handleInputChange} />
                            {errors.employeeCount && <p className={baseErrorClasses}>{errors.employeeCount}</p>}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-100 to-green-50">
            <Toast ref={toast} position="top-right" />
            <Header />
            <div className="max-w-2xl w-full mx-auto my-12 p-10 bg-white rounded-2xl shadow-lg flex-grow animate-fadeIn">
                <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">
                    {userType === 'volunteer' && 'Register as Volunteer'}
                    {userType === 'nonprofit' && 'Register as Nonprofit Admin'}
                    {userType === 'hr' && 'Register as HR Manager'}
                </h2>

                <div className="flex justify-center flex-wrap gap-3 mb-8">
                    <button onClick={() => setUserType('volunteer')} className={`px-5 py-2 border-2 rounded-lg font-semibold transition ${userType === 'volunteer' ? 'bg-teal-600 text-white border-teal-600' : 'text-teal-600 border-teal-600 hover:bg-teal-500 hover:text-white'}`}>
                        Volunteer
                    </button>
                    <button onClick={() => setUserType('nonprofit')} className={`px-5 py-2 border-2 rounded-lg font-semibold transition ${userType === 'nonprofit' ? 'bg-teal-600 text-white border-teal-600' : 'text-teal-600 border-teal-600 hover:bg-teal-500 hover:text-white'}`}>
                        Nonprofit Admin
                    </button>
                    <button onClick={() => setUserType('hr')} className={`px-5 py-2 border-2 rounded-lg font-semibold transition ${userType === 'hr' ? 'bg-teal-600 text-white border-teal-600' : 'text-teal-600 border-teal-600 hover:bg-teal-500 hover:text-white'}`}>
                        HR Manager
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Full Name</label>
                        <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500" value={formData[userType].name} onChange={handleInputChange} required />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Email Address</label>
                        <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500" value={formData[userType].email} onChange={handleInputChange} required />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Password</label>
                        <input type="password" id="password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500" value={formData[userType].password} onChange={handleInputChange} required />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Confirm Password</label>
                        <input type="password" id="confirmPassword" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500" value={formData[userType].confirmPassword} onChange={handleInputChange} required />
                        {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {renderFormFields()}

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
