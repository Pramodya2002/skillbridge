import React from 'react';

const Footer: React.FC = () => (
    <footer className="py-4 px-8 bg-gray-800 text-center text-gray-100 text-sm">
        <p>&copy; 2025 SkillBridge. All rights reserved.</p>

        <div className="flex justify-center mt-2 space-x-2">
            <a
                href="#"
                className="text-gray-400 hover:bg-teal-400 hover:text-white rounded-full p-2 transition-colors duration-300"
            >
                {/* Example: Replace with your icon */}
                <i className="pi pi-facebook"></i>
            </a>
            <a
                href="#"
                className="text-gray-400 hover:bg-teal-400 hover:text-white rounded-full p-2 transition-colors duration-300"
            >
                <i className="pi pi-twitter"></i>
            </a>
            <a
                href="#"
                className="text-gray-400 hover:bg-teal-400 hover:text-white rounded-full p-2 transition-colors duration-300"
            >
                <i className="pi pi-instagram"></i>
            </a>
        </div>
    </footer>
);

export default Footer;
