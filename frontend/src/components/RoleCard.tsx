import React from 'react';
import { Link } from 'react-router-dom';

type RoleCardProps = {
    icon: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
};

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, buttonLabel, buttonLink }) => (
    <div className="flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-md p-10 min-h-[440px] max-w-sm flex-1 transition-transform transform hover:-translate-y-1.5 hover:shadow-xl">
        <img
            src={icon}
            alt={`${title} icon`}
            className="w-24 h-24 mb-4 p-3 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl object-contain shadow-md transition-transform transform hover:scale-105 hover:shadow-xl"
        />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-base mb-6 flex-grow text-center">{description}</p>
        <Link
            to={buttonLink}
            className="inline-block px-7 py-3 bg-gradient-to-br from-teal-700 to-teal-500 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 hover:shadow-lg hover:from-teal-400 hover:to-teal-700"
        >
            {buttonLabel}
        </Link>
    </div>
);

export default RoleCard;
