import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

type VolunteerData = {
    name: string;
    email: string;
    phone?: string;
    skills?: string[];
    causes?: string[];
    availability?: string;
    experience_level?: string;
    portfolio?: string;
};

const VolunteerProfile: React.FC = () => {
    const [volunteer, setVolunteer] = useState<VolunteerData>({
        name: "",
        email: "",
        skills: [],
        causes: [],
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const volunteerDetails = JSON.parse(localStorage.getItem("volunteer") || "{}");

        setVolunteer({
            name: user.name || volunteerDetails.name || "Volunteer",
            email: user.email || volunteerDetails.email || "volunteer@example.com",
            phone: volunteerDetails.phone || "",
            skills: volunteerDetails.skills || [],
            causes: volunteerDetails.causes || [],
            availability: volunteerDetails.availability || "",
            experience_level: volunteerDetails.experience_level || "",
            portfolio: volunteerDetails.portfolio || "",
        });
    }, []);

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-3xl rounded-3xl shadow-2xl bg-white p-10 animate-fadeIn">
                <h1 className="text-4xl font-extrabold text-teal-700 mb-8 border-b-4 border-teal-200 pb-3">
                    Volunteer Profile
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column: Personal Info */}
                    <div className="space-y-4">
                        <p><span className="font-semibold text-gray-700">Name:</span> {volunteer.name}</p>
                        <p><span className="font-semibold text-gray-700">Email:</span> {volunteer.email}</p>
                        {volunteer.phone && <p><span className="font-semibold text-gray-700">Phone:</span> {volunteer.phone}</p>}
                        {volunteer.availability && <p><span className="font-semibold text-gray-700">Availability:</span> {volunteer.availability}</p>}
                        {volunteer.experience_level && <p><span className="font-semibold text-gray-700">Experience:</span> {volunteer.experience_level}</p>}
                        {volunteer.portfolio && (
                            <p>
                                <span className="font-semibold text-gray-700">Portfolio:</span>{" "}
                                <a href={volunteer.portfolio} target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">
                                    {volunteer.portfolio}
                                </a>
                            </p>
                        )}
                    </div>

                    {/* Right column: Skills and Causes */}
                    <div className="space-y-6">
                        {volunteer.skills && volunteer.skills.length > 0 && (
                            <div>
                                <h2 className="font-semibold text-gray-700 mb-2">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {volunteer.skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {volunteer.causes && volunteer.causes.length > 0 && (
                            <div>
                                <h2 className="font-semibold text-gray-700 mb-2">Cause Interests</h2>
                                <div className="flex flex-wrap gap-2">
                                    {volunteer.causes.map((cause, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            {cause}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Button */}
                <div className="mt-10 flex justify-center">
                    <Button
                        label="Edit Profile"
                        icon="pi pi-user-edit"
                        className="p-button-sm rounded-full bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white shadow-md transition-all transform hover:-translate-y-1"
                        onClick={() => alert("Edit profile clicked")}
                    />
                </div>
            </Card>
        </div>
    );
};

export default VolunteerProfile;
