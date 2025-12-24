import React from 'react';
import logoImage from '../assets/logo2.png';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const location = useLocation();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-teal-950/90 border-b border-white/10 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative flex flex-col sm:flex-row justify-between items-center px-6 sm:px-8 py-5 sm:py-6 max-w-7xl mx-auto gap-4 sm:gap-0">
                {/* Logo */}
                <Link to="/" className="flex items-center group">
                    <div className="relative">
                        <img
                            src={logoImage}
                            alt="SkillBridge"
                            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full ring-4 ring-white/30 shadow-2xl object-cover transition-all duration-500 group-hover:scale-110 group-hover:ring-teal-400 group-hover:shadow-teal-400/50"
                        />
                        <div className="absolute inset-0 rounded-full bg-teal-400 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    </div>
                    <span className="ml-3 sm:ml-4 text-xl sm:text-2xl font-black text-white tracking-tight">
                        SkillBridge
                    </span>
                </Link>

                <nav className="flex items-center gap-6 sm:gap-8">
                    <Link
                        to="/"
                        className={`relative px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-full transition-all duration-400
              ${location.pathname === '/'
                                ? 'bg-white/20 text-white shadow-lg backdrop-blur-md ring-2 ring-white/30'
                                : 'text-teal-100 hover:bg-white/10 hover:text-white hover:shadow-md'
                            }`}
                    >
                        Home
                        {location.pathname === '/' && (
                            <span className="absolute inset-0 rounded-full bg-teal-500 blur-xl opacity-30 -z-10"></span>
                        )}
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;