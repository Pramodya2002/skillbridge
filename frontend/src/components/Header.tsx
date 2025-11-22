import React from 'react';
import logoImage from '../assets/logo2.png';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const location = useLocation();

    return (
        <header className="flex justify-between items-center px-8 py-4 bg-teal-800 text-white h-30">
            {/* Logo */}
            <div className="flex items-center">
                <img
                    src={logoImage}
                    alt="SkillBridge Logo"
                    className="h-24 w-24 rounded-full object-cover bg-transparent p-0 shadow-none"
                />
            </div>

            {/* Navigation */}
            <nav className="flex items-center">
                <Link
                    to="/"
                    className={`
                        ml-6 px-4 py-2 rounded-md font-medium transition-all duration-300
                        ${location.pathname === '/' ? 'bg-teal-800 text-white' : 'text-gray-200 hover:bg-teal-500 hover:text-white hover:shadow-md transform hover:-translate-y-1'}
                    `}
                >
                    Home
                </Link>
                {/* Add more links here if needed */}
            </nav>
        </header>
    );
};

export default Header;
