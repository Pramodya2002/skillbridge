import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
    const location = useLocation();

    const scrollToSection = (sectionId: string) => {
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            window.location.href = `/#${sectionId}`;
        }
    };

    React.useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                const element = document.getElementById(id);
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [location]);


    return (
        <footer className="relative bg-gradient-to-t from-teal-950 via-teal-900/90 to-gray-900/90 backdrop-blur-2xl border-t border-white/10 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-16 text-center text-gray-200">
                <div className="mb-12 grid md:grid-cols-3 gap-10 items-center">
                    {/* Logo */}
                    <div className="flex justify-center md:justify-start">
                        <h3 className="text-3xl font-black text-white tracking-tight">
                            SkillBridge
                        </h3>
                    </div>

                    {/* Quick Links */}
                    <div className="flex justify-center space-x-10 text-lg">
                        <button
                            onClick={() => scrollToSection('hero')}
                            className="hover:text-teal-400 transition-colors duration-300 cursor-pointer"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => scrollToSection('about')}
                            className="hover:text-teal-400 transition-colors duration-300 cursor-pointer"
                        >
                            About
                        </button>
                        <button
                            onClick={() => scrollToSection('roles')}
                            className="hover:text-teal-400 transition-colors duration-300 cursor-pointer"
                        >
                            Roles
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="hover:text-teal-400 transition-colors duration-300 cursor-pointer"
                        >
                            Contact
                        </button>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <form className="flex gap-3 max-w-sm">
                            <input
                                type="email"
                                placeholder="Stay updated"
                                className="px-5 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 text-sm"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/50 transform hover:scale-105 transition-all duration-300 text-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-sm text-gray-400">
                        © 2025 SkillBridge. All rights reserved.
                    </p>

                    <div className="flex space-x-6">
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="group relative p-4 text-gray-400 hover:text-white transition-all duration-500"
                        >
                            <i className="pi pi-facebook text-2xl"></i>
                            <span className="absolute inset-0 rounded-full bg-teal-500 scale-0 group-hover:scale-150 transition-transform duration-500 blur-xl opacity-50"></span>
                        </a>
                        <a
                            href="#"
                            aria-label="Twitter"
                            className="group relative p-4 text-gray-400 hover:text-white transition-all duration-500"
                        >
                            <i className="pi pi-twitter text-2xl"></i>
                            <span className="absolute inset-0 rounded-full bg-teal-500 scale-0 group-hover:scale-150 transition-transform duration-500 blur-xl opacity-50"></span>
                        </a>
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="group relative p-4 text-gray-400 hover:text-white transition-all duration-500"
                        >
                            <i className="pi pi-instagram text-2xl"></i>
                            <span className="absolute inset-0 rounded-full bg-teal-500 scale-0 group-hover:scale-150 transition-transform duration-500 blur-xl opacity-50"></span>
                        </a>
                    </div>
                </div>

                <p className="mt-10 text-xs text-gray-500">
                    Made with ❤️ for a better world
                </p>
            </div>
        </footer>
    );
};

export default Footer;