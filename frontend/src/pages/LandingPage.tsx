import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import volunteerIcon from '../assets/volunteer.png';
import nonprofitIcon from '../assets/nonprofit.png';
import hrIcon from '../assets/hr.png';
import headerimage from '../assets/header_image.jpg';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const [showTopButton, setShowTopButton] = useState(false);
    const [activeTab, setActiveTab] = useState<'volunteer' | 'nonprofit' | 'hr'>('volunteer');


    useEffect(() => {
        const handleScroll = () => setShowTopButton(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="landing font-sans overflow-x-hidden">            <Header />

            {/* Hero Section */}
            <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-gray-50 to-emerald-50">
                <div className="absolute inset-0 bg-teal-600 opacity-5"></div>
                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 z-10">
                        <div className="inline-block">
                            <h1 className="text-5xl lg:text-7xl font-black text-teal-900 leading-tight">
                                Connect Skills
                                <span className="block text-teal-600">with Purpose</span>
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-teal-600 to-emerald-500 mt-4 rounded-full"></div>
                        </div>

                        <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
                            Bridge the gap between talented volunteers and meaningful nonprofit opportunities.
                            Make an impact with your skills and contribute to causes that matter.
                        </p>

                        <div className="flex flex-wrap gap-5 pt-6">
                            <Link
                                to="/login"
                                className="group px-8 py-4 bg-teal-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex items-center gap-3"
                            >
                                Login
                                <span className="group-hover:translate-x-2 transition-transform">→</span>
                            </Link>
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-white text-teal-700 font-bold text-lg rounded-2xl border-4 border-teal-600 shadow-lg hover:bg-teal-600 hover:text-white transform hover:-translate-y-2 transition-all duration-300"
                            >
                                Register Now
                            </Link>
                        </div>
                    </div>

                    <div className="relative flex justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-emerald-400 blur-3xl opacity-30 scale-125"></div>
                        <img
                            src={headerimage}
                            alt="Impact in action"
                            className="relative z-10 w-full max-w-lg rounded-[40%_60%_50%_50% / 30%_40%_60%_70%] shadow-2xl ring-8 ring-white/50 hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>


                <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-32 relative bg-gradient-to-b from-teal-50 via-white to-emerald-50 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 right-0 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <div className="mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-teal-900 mb-4 tracking-tight">
                            About Us
                        </h2>
                        <p className="text-2xl font-semibold text-teal-700 mb-6">
                            Empowering change through skillful connections
                        </p>
                        <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                            SkillBridge is a platform dedicated to connecting skilled volunteers with nonprofit organizations in need.
                            We believe in the power of skills to drive meaningful change and empower communities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                        <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/40 hover:shadow-2xl transform hover:-translate-y-6 transition-all duration-500 hover:z-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 w-24 h-24 bg-teal-400 rounded-full blur-2xl opacity-40 scale-0 group-hover:scale-100 transition-transform duration-700 mx-auto"></div>
                                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center text-5xl shadow-lg ring-8 ring-white/50">
                                    🌍
                                </div>
                            </div>

                            <h4 className="text-2xl font-bold text-teal-800 mb-4">Our Mission</h4>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                To bridge the gap between passionate professionals and impactful organizations by fostering meaningful connections that empower communities worldwide.
                            </p>
                        </div>

                        <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/40 hover:shadow-2xl transform hover:-translate-y-8 md:translate-y-8 transition-all duration-500 hover:z-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 w-24 h-24 bg-emerald-400 rounded-full blur-2xl opacity-40 scale-0 group-hover:scale-100 transition-transform duration-700 mx-auto"></div>
                                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-5xl shadow-lg ring-8 ring-white/50">
                                    🤝
                                </div>
                            </div>

                            <h4 className="text-2xl font-bold text-teal-800 mb-4">Our Vision</h4>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                A world where skilled individuals contribute to the social good by offering their time and expertise to the causes that matter most.
                            </p>
                        </div>

                        <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/40 hover:shadow-2xl transform hover:-translate-y-6 transition-all duration-500 hover:z-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 w-24 h-24 bg-teal-500 rounded-full blur-2xl opacity-40 scale-0 group-hover:scale-100 transition-transform duration-700 mx-auto"></div>
                                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center text-5xl shadow-lg ring-8 ring-white/50">
                                    💡
                                </div>
                            </div>

                            <h4 className="text-2xl font-bold text-teal-800 mb-4">Why SkillBridge?</h4>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                Whether you're a volunteer looking to give back or a nonprofit organization in need of talent, SkillBridge simplifies the process with smart matching and seamless collaboration tools.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Choose Your Role */}
            <section id="roles" className="py-32 relative bg-gradient-to-b from-teal-50/50 via-white to-emerald-50 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-32 right-20 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-ping"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <div className="mb-20">
                        <h2 className="text-5xl md:text-6xl font-black text-teal-900 tracking-tight mb-4">
                            Choose Your Role
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto">
                            Join our community and start making a difference today
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        <div className="group relative transform-gpu perspective-1000">
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 
                        hover:shadow-3xl hover:-translate-y-8 transition-all duration-700 
                        hover:rotate-y-3 hover:rotate-x-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="relative mb-8">
                                    <div className="absolute inset-0 w-32 h-32 bg-teal-400 rounded-full blur-3xl opacity-40 scale-0 group-hover:scale-100 transition-transform duration-700 mx-auto"></div>
                                    <img src={volunteerIcon} alt="Volunteer" className="relative mx-auto w-32 h-32 object-contain drop-shadow-2xl" />
                                </div>

                                <h3 className="text-3xl font-bold text-teal-800 mb-4">Volunteer</h3>
                                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                                    Share your skills and expertise with nonprofit organizations that need your help.
                                </p>

                                <Link
                                    to="/register?role=volunteer"
                                    className="relative inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10">Register as Volunteer</span>
                                    <span className="relative z-10 text-2xl">➡️</span>
                                    <span className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-2xl"></span>
                                </Link>
                            </div>
                        </div>

                        <div className="group relative transform-gpu perspective-1000 md:mt-8">
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 
                        hover:shadow-3xl hover:-translate-y-12 transition-all duration-700 
                        hover:rotate-y-[-3deg] hover:rotate-x-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="relative mb-8">
                                    <div className="absolute inset-0 w-32 h-32 bg-emerald-400 rounded-full blur-3xl opacity-40 scale-0 group-hover:scale-100 transition-transform duration-700 mx-auto"></div>
                                    <img src={nonprofitIcon} alt="Nonprofit" className="relative mx-auto w-32 h-32 object-contain drop-shadow-2xl" />
                                </div>

                                <h3 className="text-3xl font-bold text-teal-800 mb-4">Nonprofit Admin</h3>
                                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                                    Post tasks and projects to connect with skilled volunteers.
                                </p>

                                <Link
                                    to="/register?role=nonprofit"
                                    className="relative inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10">Register as Nonprofit</span>
                                    <span className="relative z-10 text-2xl">➡️</span>
                                    <span className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-2xl"></span>
                                </Link>
                            </div>
                        </div>

                        <div className="group relative transform-gpu perspective-1000">
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 
                        hover:shadow-3xl hover:-translate-y-8 transition-all duration-700 
                        hover:rotate-y-[-3deg] hover:rotate-x-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="relative mb-8">
                                    <div className="absolute inset-0 w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-40 scale-0 group-hover:scale-100 transition-transform duration-700 mx-auto"></div>
                                    <img src={hrIcon} alt="HR Manager" className="relative mx-auto w-32 h-32 object-contain drop-shadow-2xl" />
                                </div>

                                <h3 className="text-3xl font-bold text-teal-800 mb-4">HR Manager</h3>
                                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                                    Manage volunteer programs and coordinate between your organization and skilled volunteers.
                                </p>

                                <Link
                                    to="/register?role=hr"
                                    className="relative inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10">Register as HR Admin</span>
                                    <span className="relative z-10 text-2xl">➡️</span>
                                    <span className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-2xl"></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-gradient-to-br from-teal-50 to-gray-100">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-black text-teal-900 mb-4">How It Works</h2>
                    <p className="text-xl text-gray-700 mb-16">Simple steps. Big impact.</p>

                    <div className="relative">
                        <div className="flex justify-center gap-4 mb-10 flex-wrap">
                            {['volunteer', 'nonprofit', 'hr'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`relative px-10 py-5 text-lg font-bold rounded-full transition-all duration-500 overflow-hidden ${activeTab === tab
                                        ? 'bg-teal-600 text-white shadow-2xl'
                                        : 'bg-white/80 backdrop-blur text-teal-700 hover:bg-teal-100'
                                        }`}
                                >
                                    <span className="relative z-10">
                                        {tab === 'volunteer' ? 'Volunteers' : tab === 'nonprofit' ? 'Nonprofits' : 'HR Teams'}
                                    </span>
                                    {activeTab === tab && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-teal-100">
                            <ol className="space-y-6 text-left text-lg">
                                {(activeTab === 'volunteer' ? [
                                    "Create Your Profile – Add skills, causes, and availability",
                                    "Browse & Self-Match – Find tasks that fit your expertise",
                                    "Collaborate & Deliver – Work directly with nonprofits",
                                    "Earn Badges – Get recognized for your contributions",
                                    "Track Impact – See your volunteer journey grow"
                                ] : activeTab === 'nonprofit' ? [
                                    "Register Your Organization – Share your mission",
                                    "Post Tasks – Specify skills and time needed",
                                    "Get Matches – Receive qualified volunteer applications",
                                    "Collaborate – Manage projects with ease",
                                    "Rate & Grow – Build a trusted volunteer network"
                                ] : [
                                    "Enroll Your Team – Link employees to SkillBridge",
                                    "Track Engagement – Monitor hours and skills used",
                                    "View Feedback – See nonprofit evaluations",
                                    "Generate Reports – For CSR and HR goals",
                                    "Celebrate Impact – Recognize top volunteers"
                                ]).map((step, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                                            {i + 1}
                                        </span>
                                        <span className="text-gray-800 font-medium pt-1.5">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section id="contact" className="py-32 relative bg-gradient-to-b from-teal-50 via-white to-emerald-50 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 -left-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-10 -right-32 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-ping"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <div className="mb-12">
                        <h2 className="text-5xl md:text-6xl font-black text-teal-900 mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                            Have a question or want to collaborate? We'd love to hear from you.
                        </p>
                    </div>

                    <form className="relative bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-10 md:p-14 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="relative z-10 space-y-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="peer w-full px-6 py-5 bg-white/60 backdrop-blur border border-gray-300/50 rounded-2xl text-gray-800 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 text-lg"
                                    placeholder="Your Name"
                                />
                                <label className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-teal-600 peer-focus:text-sm peer-focus:bg-white peer-focus:px-2 peer-placeholder-shown:text-lg -top-3 bg-white px-2 text-teal-600 text-sm">
                                    Your Name
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    className="peer w-full px-6 py-5 bg-white/60 backdrop-blur border border-gray-300/50 rounded-2xl text-gray-800 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 text-lg"
                                    placeholder="Your Email"
                                />
                                <label className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-teal-600 peer-focus:text-sm peer-focus:bg-white peer-focus:px-2 peer-placeholder-shown:text-lg -top-3 bg-white px-2 text-teal-600 text-sm">
                                    Your Email
                                </label>
                            </div>

                            <div className="relative">
                                <textarea
                                    required
                                    rows={6}
                                    className="peer w-full px-6 py-5 bg-white/60 backdrop-blur border border-gray-300/50 rounded-2xl text-gray-800 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 text-lg resize-none"
                                    placeholder="Your Message"
                                />
                                <label className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-teal-600 peer-focus:text-sm peer-focus:bg-white peer-focus:px-2 peer-placeholder-shown:text-lg -top-3 bg-white px-2 text-teal-600 text-sm">
                                    Your Message
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="relative w-full md:w-auto mx-auto px-16 py-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group/button flex items-center justify-center gap-3"
                            >
                                <span className="relative z-10">Send Message</span>
                                <span className="relative z-10 text-2xl group-hover/button:translate-x-2 transition-transform">→</span>

                                <span className="absolute inset-0 bg-white/30 scale-0 group-hover/button:scale-150 transition-transform duration-700 rounded-full"></span>
                            </button>
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-400 to-emerald-400 rounded-full filter blur-3xl opacity-30 -translate-y-16 translate-x-16"></div>
                    </form>


                </div>
            </section>

            {/* CTA Section */}
            <section className="py-28 bg-gradient-to-r from-teal-700 to-emerald-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-5xl lg:text-6xl font-black mb-6">Ready to Make an Impact?</h2>
                    <p className="text-xl lg:text-2xl mb-10 opacity-90">
                        Join thousands already changing the world through skills and purpose.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-4 px-12 py-6 bg-white text-teal-700 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                    >
                        Get Started Free
                        <span className="text-3xl">→</span>
                    </Link>
                </div>
            </section>

            <Footer />

            {/* Back to Top Button */}
            {showTopButton && (
                <button
                    className="fixed bottom-10 right-8 w-12 h-12 bg-gradient-to-br from-teal-700 to-teal-500 rounded-full text-white text-2xl flex items-center justify-center shadow-lg hover:bg-teal-800 hover:scale-110 transition-transform z-50"
                    onClick={scrollToTop}
                    aria-label="Back to Top"
                >
                    ⮝
                </button>
            )}
        </div>
    );
};

export default LandingPage;
