import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RoleCard from '../components/RoleCard';
import volunteerIcon from '../assets/volunteer.png';
import nonprofitIcon from '../assets/nonprofit.png';
import hrIcon from '../assets/hr.png';
import headerimage from '../assets/header_image.jpg';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const [showTopButton, setShowTopButton] = useState(false);
    const [activeTab, setActiveTab] = useState<'volunteer' | 'nonprofit' | 'hr'>('volunteer');


    useEffect(() => {
        const handleScroll = () => {
            setShowTopButton(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="landing font-sans">
            <Header />

            {/* Hero Section */}
            <section className="flex flex-col md:flex-row justify-between items-center gap-8 p-16 bg-gradient-to-br from-gray-100 to-teal-100 border-b-2 border-gray-300 animate-fadeIn">
                <div className="flex-1 text-gray-800 animate-slideIn">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-teal-700">
                        Connect Skills with Purpose
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                        Bridge the gap between talented volunteers and meaningful nonprofit opportunities.
                        <br />
                        Make an impact with your skills and contribute to causes that matter.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/login"
                            className="px-6 py-3 bg-gradient-to-br from-teal-700 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-transform duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-3 border-2 border-teal-700 text-teal-700 font-semibold rounded-xl hover:bg-teal-700 hover:text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-transform duration-200"
                        >
                            Register
                        </Link>
                    </div>
                </div>
                <div className="flex-1 flex justify-center items-center relative z-10">
                    <img
                        src={headerimage}
                        alt="Volunteers illustration"
                        className="w-11/12 max-w-xl rounded-[30%_70%_70%_30%] shadow-2xl transition-transform duration-400 hover:scale-105"
                    />
                </div>
            </section>

            {/* About Us Section */}
            <section className="py-20 bg-gradient-to-b from-green-50 to-white border-t-4 border-b-4 border-gray-200 animate-fadeInSection">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-800 uppercase mb-2">
                        About Us
                    </h2>
                    <p className="text-teal-600 font-semibold mb-4 text-lg">
                        Empowering change through skillful connections
                    </p>
                    <p className="text-gray-600 max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
                        SkillBridge is a platform dedicated to connecting skilled volunteers with nonprofit organizations in need.
                        We believe in the power of skills to drive meaningful change and empower communities.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 text-center flex-1 min-w-[260px]">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-2xl text-teal-700">
                                🌍
                            </div>
                            <h4 className="text-xl font-bold text-teal-700 mb-2">Our Mission</h4>
                            <p className="text-gray-600 leading-relaxed">
                                To bridge the gap between passionate professionals and impactful organizations by fostering meaningful connections that empower communities worldwide.
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 text-center flex-1 min-w-[260px]">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-2xl text-teal-700">
                                🤝
                            </div>
                            <h4 className="text-xl font-bold text-teal-700 mb-2">Our Vision</h4>
                            <p className="text-gray-600 leading-relaxed">
                                A world where skilled individuals contribute to the social good by offering their time and expertise to the causes that matter most.
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 text-center flex-1 min-w-[260px]">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-2xl text-teal-700">
                                💡
                            </div>
                            <h4 className="text-xl font-bold text-teal-700 mb-2">Why SkillBridge?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Whether you're a volunteer looking to give back or a nonprofit organization in need of talent, SkillBridge simplifies the process with smart matching and seamless collaboration tools.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Choose Role Section */}
            <section className="py-16 bg-white text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 uppercase mb-2">Choose Your Role</h2>
                <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">Join our community and start making a difference today</p>
                <div className="flex flex-wrap justify-center gap-8">
                    <RoleCard
                        icon={volunteerIcon}
                        title="Volunteer"
                        description="Share your skills and expertise with nonprofit organizations that need your help."
                        buttonLabel="Register as Volunteer"
                        buttonLink="/register?role=volunteer"
                    />
                    <RoleCard
                        icon={nonprofitIcon}
                        title="Nonprofit Admin"
                        description="Post tasks and projects to connect with skilled volunteers."
                        buttonLabel="Register as Nonprofit"
                        buttonLink="/register?role=nonprofit"
                    />
                    <RoleCard
                        icon={hrIcon}
                        title="HR Manager"
                        description="Manage volunteer programs and coordinate between your organization and skilled volunteers."
                        buttonLabel="Register as HR Admin"
                        buttonLink="/register?role=hr"
                    />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-gradient-to-br from-gray-100 to-teal-50 text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 uppercase mb-2">How SkillBridge Works</h2>
                <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
                    Discover how SkillBridge empowers each user group to make meaningful impact
                </p>

                {/* Tabs */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center mb-6">
                        {['volunteer', 'nonprofit', 'hr'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as "volunteer" | "nonprofit" | "hr")}

                                className={`px-6 py-3 font-semibold border-2 rounded-t-lg mr-2 transition-colors ${activeTab === tab
                                    ? 'bg-teal-700 text-white border-teal-700'
                                    : 'text-teal-700 border-teal-700 hover:bg-teal-700 hover:text-white'
                                    }`}
                            >
                                {tab === 'volunteer' ? 'Volunteers' : tab === 'nonprofit' ? 'Nonprofit Admins' : 'HR Managers'}
                            </button>
                        ))}
                    </div>

                    {/* Tab Panels */}
                    <div className="bg-white rounded-b-xl p-8 shadow-lg text-left">
                        {/* Volunteer Panel */}
                        {activeTab === 'volunteer' && (
                            <ul className="list-none space-y-3">
                                <li><strong>1.</strong> Create Your Profile – Add your skills, causes you care about, and availability.</li>
                                <li><strong>2.</strong> Self-Match to Tasks – Filter opportunities based on skills, time, and interest.</li>
                                <li><strong>3.</strong> Volunteer & Make Impact – Collaborate on tasks that need your expertise.</li>
                                <li><strong>4.</strong> Earn Skill Badges – Get recognized for tasks completed using specific skills.</li>
                                <li><strong>5.</strong> Track Progress – View feedback, earned badges, and engagement summary.</li>
                            </ul>
                        )}

                        {/* Nonprofit Panel */}
                        {activeTab === 'nonprofit' && (
                            <ul className="list-none space-y-3">
                                <li><strong>1.</strong> Register Your Organization – Showcase your mission and needs.</li>
                                <li><strong>2.</strong> Post Volunteer Tasks – Specify required skills, duration, and causes.</li>
                                <li><strong>3.</strong> Match with Volunteers – SkillBridge recommends ideal matches based on task requirements.</li>
                                <li><strong>4.</strong> Review Applications – Approve or reject volunteers and provide task feedback.</li>
                                <li><strong>5.</strong> Rate Volunteers – Leave feedback after task completion to support HR insights.</li>
                            </ul>
                        )}

                        {/* HR Panel */}
                        {activeTab === 'hr' && (
                            <ul className="list-none space-y-3">
                                <li><strong>1.</strong> Enroll Your Company – Create an HR account and link employees to SkillBridge.</li>
                                <li><strong>2.</strong> Monitor Engagement – Track volunteer hours, tasks completed, and skills applied.</li>
                                <li><strong>3.</strong> Review Feedback – Access evaluations from nonprofits on employee performance.</li>
                                <li><strong>4.</strong> Analyze Impact – Generate detailed reports aligned with HR and CSR goals.</li>
                                <li><strong>5.</strong> Celebrate Achievements – Recognize high-impact volunteers through badges and leaderboards.</li>
                            </ul>
                        )}
                    </div>
                </div>
            </section>


            {/* Contact Form */}
            <section className="py-16 bg-gray-100 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
                <form className="max-w-lg mx-auto flex flex-col gap-4">
                    <input type="text" placeholder="Your Name" required className="p-3 border rounded-lg text-gray-700" />
                    <input type="email" placeholder="Your Email" required className="p-3 border rounded-lg text-gray-700" />
                    <textarea placeholder="Your Message" rows={5} required className="p-3 border rounded-lg text-gray-700" />
                    <button type="submit" className="py-3 px-6 bg-teal-700 text-white font-bold rounded-lg hover:bg-teal-500 transition-colors">Send Message</button>
                </form>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-teal-700 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
                <p className="mb-6">Join thousands of volunteers and nonprofit organizations already making an impact through SkillBridge</p>
                <Link to="/register" className="py-3 px-6 bg-teal-500 rounded-md font-bold hover:bg-teal-600 transition-colors">Get Started Today</Link>
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
