import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import Select from "react-select";
import type { MultiValue, ActionMeta } from "react-select";

type OptionType = { value: string; label: string };
type MultiValueType = OptionType[];

const skillOptions: OptionType[] = [
    { value: "graphic-design", label: "Graphic Design" },
    { value: "web-development", label: "Web Development" },
    { value: "content-writing", label: "Content Writing" },
    { value: "data-analysis", label: "Data Analysis" },
    { value: "marketing", label: "Marketing" },
    { value: "project-management", label: "Project Management" },
    { value: "fundraising", label: "Fundraising" },
    { value: "event-planning", label: "Event Planning" },
    { value: "teaching", label: "Teaching & Training" },
    { value: "translation", label: "Translation" },
];

const causeOptions: OptionType[] = [
    { value: "education", label: "Education" },
    { value: "health", label: "Health" },
    { value: "environment", label: "Environment" },
    { value: "animal-welfare", label: "Animal Welfare" },
    { value: "youth", label: "Youth Empowerment" },
    { value: "human-rights", label: "Human Rights" },
    { value: "arts", label: "Arts & Culture" },
    { value: "disaster-relief", label: "Disaster Relief" },
    { value: "technology", label: "Technology for Good" },
    { value: "sports", label: "Sports & Recreation" },
];

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const timeBlocks = ["morning", "afternoon", "evening", "flexible"];

type SkillWithLevel = { skill: string; level: string };
type VolunteerData = {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    skills?: SkillWithLevel[];
    causes?: string[];
    availability?: { [day: string]: string[] };
    max_hours_per_week?: number;
    portfolio?: string;
};

const VolunteerProfile: React.FC = () => {
    const toast = useRef<Toast>(null);

    const [volunteer, setVolunteer] = useState<VolunteerData>({
        name: "", email: "", skills: [], causes: [], availability: {},
    });

    const [selectedSkills, setSelectedSkills] = useState<MultiValueType>([]);
    const [skillLevels, setSkillLevels] = useState<{ [skill: string]: string }>({});
    const [selectedCauses, setSelectedCauses] = useState<MultiValueType>([]);
    const [availabilityMode, setAvailabilityMode] = useState<"weekly" | "hours">("weekly");

    const handleSkillsChange = (newSkills: MultiValue<OptionType>, _actionMeta: ActionMeta<OptionType>) => {
        const mutableSkills = [...newSkills];
        setSelectedSkills(mutableSkills);
        const updatedLevels: { [skill: string]: string } = { ...skillLevels };
        mutableSkills.forEach((s) => {
            if (!updatedLevels[s.value]) updatedLevels[s.value] = "intermediate";
        });
        setSkillLevels(updatedLevels);
    };

    const handleCausesChange = (newCauses: MultiValue<OptionType>, _actionMeta: ActionMeta<OptionType>) => {
        setSelectedCauses([...newCauses]);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        fetch("http://localhost:8000/api/profile", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => res.json())
            .then((data) => {
                const roleData = data.roleData || {};
                setVolunteer({ ...data.user, ...roleData });
                setSelectedSkills(
                    (roleData.skills || []).map((s: SkillWithLevel) => ({
                        value: s.skill,
                        label: s.skill.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                    }))
                );
                const levels: { [key: string]: string } = {};
                (roleData.skills || []).forEach((s: SkillWithLevel) => {
                    levels[s.skill] = s.level;
                });
                setSkillLevels(levels);
                setSelectedCauses(
                    (roleData.causes || []).map((c: string) => ({
                        value: c,
                        label: c.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                    }))
                );
            })
            .catch((err) => console.error("Error fetching profile:", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setVolunteer((prev) => ({ ...prev, [id]: value }));
    };

    const handleSkillLevelChange = (skill: string, level: string) => {
        setSkillLevels((prev) => ({ ...prev, [skill]: level }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: volunteer.name,
            email: volunteer.email,
            phone: volunteer.phone,
            skills: selectedSkills.map((s) => ({
                skill: s.value,
                level: skillLevels[s.value] || "intermediate",
            })),
            causes: selectedCauses.map((c) => c.value),
            availability: availabilityMode === "weekly" ? volunteer.availability : {},
            max_hours_per_week: availabilityMode === "hours" ? volunteer.max_hours_per_week : null,
            portfolio: volunteer.portfolio,
        };

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("http://localhost:8000/api/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.current?.show({
                    severity: "success",
                    summary: "Profile Updated!",
                    detail: "Your profile has been updated successfully!",
                    life: 4000,

                    className: "w-full max-w-md shadow-2xl",

                    pt: {
                        root: {
                            className: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl overflow-hidden border-0"
                        },
                        icon: { className: "hidden" },
                        content: { className: "flex-1" },
                        summary: { className: "font-black text-xl" },
                        detail: { className: "text-white/90 mt-1" },
                        closeButton: {
                            className: "text-white/70 hover:text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-all"
                        }

                    },

                    icon: () => (
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/25 rounded-full mr-5 shadow-xl">
                            <i className="pi pi-check text-4xl text-white"></i>
                        </div>
                    ),

                    style: {
                        animation: "toastSlideIn 0.6s ease-out",
                    }
                });
            } else {
                const err = await res.json();
                toast.current?.show({
                    severity: "error",
                    summary: "Update Failed",
                    detail: err.message || "Something went wrong",
                    life: 5000,
                });
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Network Error",
                detail: "Please check your connection and try again",
                life: 5000,
            });
        }
    };

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const customSelectStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(209, 213, 219, 0.5)",
            borderRadius: "1rem",
            padding: "0.5rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            "&:hover": { borderColor: "#14b8a6" },
        }),
        multiValue: (base: any) => ({
            ...base,
            background: "linear-gradient(to right, #14b8a6, #10b981)",
            color: "white",
            borderRadius: "9999px",
            padding: "0.25rem 0.75rem",
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            color: "white",
            fontWeight: "bold",
        }),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-10 px-6">
            <Toast
                ref={toast}
                position="top-right"
                pt={{
                    root: { className: "mt-20" },
                    message: { className: "w-full max-w-md" }
                }}
            />

            <div className="max-w-6xl mx-auto">
                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-10 md:p-16 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

                    <div className="relative z-10">
                        {/* Profile Header */}
                        <div className="text-center mb-12">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl ring-8 ring-white/50">
                                    {getInitials(volunteer.name || "VB")}
                                </div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 blur-2xl opacity-50 animate-pulse"></div>
                            </div>
                            <h1 className="text-5xl font-black text-teal-900 mt-6">{volunteer.name}</h1>
                            <p className="text-xl text-gray-600">{volunteer.email}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Column */}
                                <div className="space-y-8">
                                    {/* Basic Info */}
                                    {/* Full Name */}
                                    <div className="relative">
                                        <input
                                            id="name"
                                            value={volunteer.name}
                                            onChange={handleChange}
                                            className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all duration-300 text-lg shadow-inner"
                                            placeholder="Full Name"
                                        />
                                        <label className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-lg">
                                            Full Name
                                        </label>
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <input
                                            id="email"
                                            value={volunteer.email}
                                            onChange={handleChange}
                                            className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all duration-300 text-lg shadow-inner"
                                            placeholder="Email Address"
                                        />
                                        <label className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-lg">
                                            Email Address
                                        </label>
                                    </div>

                                    {/* Phone */}
                                    <div className="relative">
                                        <input
                                            id="phone"
                                            value={volunteer.phone || ""}
                                            onChange={handleChange}
                                            className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all duration-300 text-lg shadow-inner"
                                            placeholder="Phone (Optional)"
                                        />
                                        <label className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-lg">
                                            Phone (Optional)
                                        </label>
                                    </div>

                                    {/* Portfolio */}
                                    <div className="relative">
                                        <input
                                            id="portfolio"
                                            value={volunteer.portfolio || ""}
                                            onChange={handleChange}
                                            className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all duration-300 text-lg shadow-inner"
                                            placeholder="Portfolio / LinkedIn"
                                        />
                                        <label className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-lg">
                                            Portfolio / LinkedIn
                                        </label>
                                    </div>

                                    {/* Availability Mode */}
                                    <div className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-gray-200/50">
                                        <p className="text-lg font-bold text-teal-800 mb-4">Availability Preference</p>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setAvailabilityMode("weekly")}
                                                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${availabilityMode === "weekly"
                                                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xl"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                            >
                                                Weekly Schedule
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setAvailabilityMode("hours")}
                                                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${availabilityMode === "hours"
                                                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xl"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                            >
                                                Max Hours/Week
                                            </button>
                                        </div>
                                    </div>

                                    {availabilityMode === "hours" && (
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={volunteer.max_hours_per_week || ""}
                                                onChange={(e) => setVolunteer(prev => ({ ...prev, max_hours_per_week: parseInt(e.target.value) || 0 }))}
                                                className="peer w-full px-6 py-5 bg-white/60 backdrop-blur border border-gray-300/50 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 text-lg"
                                                placeholder=" "
                                            />
                                            <label className="absolute left-6 top-5 text-gray-500 text-lg pointer-events-none transition-all duration-300 peer-placeholder-shown:top-5 peer-focus:-top-4 peer-focus:text-teal-600 peer-focus:text-sm peer-focus:bg-white peer-focus:px-3 peer-focus:font-bold">
                                                Max Hours per Week
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-8">
                                    {/* Skills */}
                                    <div>
                                        <label className="block text-xl font-bold text-teal-800 mb-4">Your Skills</label>
                                        <Select
                                            isMulti
                                            options={skillOptions}
                                            value={selectedSkills}
                                            onChange={handleSkillsChange}
                                            styles={customSelectStyles}
                                            className="text-lg"
                                        />
                                        <div className="mt-6 space-y-4">
                                            {selectedSkills.map((skill) => (
                                                <div key={skill.value} className="flex items-center gap-4 bg-white/60 backdrop-blur rounded-2xl p-5 border border-gray-200/50">
                                                    <span className="font-semibold text-gray-800 flex-1">
                                                        {skill.label}
                                                    </span>
                                                    <div className="flex gap-3">
                                                        {["beginner", "intermediate", "expert"].map((level) => (
                                                            <button
                                                                key={level}
                                                                type="button"
                                                                onClick={() => handleSkillLevelChange(skill.value, level)}
                                                                className={`px-5 py-2 rounded-full font-medium transition-all ${skillLevels[skill.value] === level
                                                                    ? level === "beginner"
                                                                        ? "bg-yellow-100 text-yellow-800 ring-2 ring-yellow-500"
                                                                        : level === "intermediate"
                                                                            ? "bg-blue-100 text-blue-800 ring-2 ring-blue-500"
                                                                            : "bg-purple-100 text-purple-800 ring-2 ring-purple-500"
                                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                    }`}
                                                            >
                                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Causes */}
                                    <div>
                                        <label className="block text-xl font-bold text-teal-800 mb-4">Causes You Care About</label>
                                        <Select
                                            isMulti
                                            options={causeOptions}
                                            value={selectedCauses}
                                            onChange={handleCausesChange}
                                            styles={customSelectStyles}
                                        />
                                    </div>

                                    {/* Weekly Availability */}
                                    {availabilityMode === "weekly" && (
                                        <div className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-gray-200/50">
                                            <p className="text-xl font-bold text-teal-800 mb-6">Weekly Availability</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                {days.map((day) => (
                                                    <div key={day} className="bg-white/80 rounded-xl p-4 border border-gray-200/50">
                                                        <p className="font-bold text-gray-800 capitalize mb-3">{day}</p>
                                                        <div className="flex flex-wrap gap-3">
                                                            {timeBlocks.map((block) => (
                                                                <label key={block} className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={volunteer.availability?.[day]?.includes(block) || false}
                                                                        onChange={(e) => {
                                                                            setVolunteer((prev) => {
                                                                                const newAvail = { ...(prev.availability || {}) };
                                                                                const slots = newAvail[day] || [];
                                                                                if (e.target.checked) {
                                                                                    newAvail[day] = [...slots, block];
                                                                                } else {
                                                                                    newAvail[day] = slots.filter((s) => s !== block);
                                                                                }
                                                                                return { ...prev, availability: newAvail };
                                                                            });
                                                                        }}
                                                                        className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                                                                    />
                                                                    <span className="text-sm font-medium capitalize">{block}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-center mt-12">
                                <button
                                    type="submit"
                                    className="relative px-16 py-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-2xl rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group/button"
                                >
                                    <span className="relative z-10">Save Profile</span>
                                    <span className="absolute inset-0 bg-white/30 scale-0 group-hover/button:scale-150 transition-transform duration-700 rounded-full"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerProfile;