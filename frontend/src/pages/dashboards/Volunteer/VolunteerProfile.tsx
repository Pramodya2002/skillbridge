import React, { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
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

type SkillWithLevel = {
    skill: string;
    level: string;
};

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
        name: "",
        email: "",
        skills: [],
        causes: [],
        availability: {},
    });

    const [selectedSkills, setSelectedSkills] = useState<MultiValueType>([]);
    const [skillLevels, setSkillLevels] = useState<{ [skill: string]: string }>({});
    const [selectedCauses, setSelectedCauses] = useState<MultiValueType>([]);
    const [availabilityMode, setAvailabilityMode] = useState<"weekly" | "hours">("weekly");

    const handleSkillsChange = (newSkills: MultiValue<OptionType>, _actionMeta: ActionMeta<OptionType>) => {
        const mutableSkills = [...newSkills];
        setSelectedSkills(mutableSkills);
        const updatedLevels: { [skill: string]: string } = {};
        mutableSkills.forEach((s) => {
            updatedLevels[s.value] = skillLevels[s.value] || "beginner";
        });
        setSkillLevels(updatedLevels);
    };

    const handleCausesChange = (newCauses: MultiValue<OptionType>, _actionMeta: ActionMeta<OptionType>) => {
        setSelectedCauses([...newCauses]);
    };

    // Fetch profile from backend
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
                        label: s.skill,
                    }))
                );
                const levels: { [key: string]: string } = {};
                (roleData.skills || []).forEach((s: SkillWithLevel) => {
                    levels[s.skill] = s.level;
                });
                setSkillLevels(levels);
                setSelectedCauses(
                    (roleData.causes || []).map((c: string) => ({ value: c, label: c }))
                );
            })
            .catch((err) => console.error("Error fetching volunteer profile:", err));
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                level: skillLevels[s.value] || "beginner",
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
                    summary: "Profile Updated",
                    detail: "Your profile has been successfully updated!",
                    life: 5000,
                    closable: true,
                    style: {
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        backgroundColor: '#10B981',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    },
                    icon: 'pi pi-check-circle'
                });
            } else {
                const errText = await res.text();
                alert("Error: " + errText);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    return (
        <div className="flex justify-center py-10">
            <Toast ref={toast} position="top-right" />
            <Card className="w-full max-w-4xl rounded-3xl shadow-2xl bg-white p-10 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-28 h-28 rounded-full bg-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {getInitials(volunteer.name || "V")}
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800 mt-4">{volunteer.name}</h1>
                    <p className="text-gray-500">{volunteer.email}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <input id="name" value={volunteer.name} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border rounded" />
                        <input id="email" value={volunteer.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded" />
                        <input id="phone" value={volunteer.phone} onChange={handleChange} placeholder="Phone" className="w-full p-3 border rounded" />
                        <input id="portfolio" value={volunteer.portfolio} onChange={handleChange} placeholder="Portfolio URL" className="w-full p-3 border rounded" />

                        {/* Availability Mode Switch */}
                        <div className="space-y-2">
                            <label className="font-semibold">Availability Preference</label>
                            <select
                                value={availabilityMode}
                                onChange={(e) => setAvailabilityMode(e.target.value as "weekly" | "hours")}
                                className="w-full p-3 border rounded"
                            >
                                <option value="weekly">Weekly Availability</option>
                                <option value="hours">Max Hours per Week</option>
                            </select>
                        </div>

                        {/* Weekly Availability Grid */}
                        {availabilityMode === "weekly" && (
                            <div className="space-y-4">
                                <label className="font-semibold text-teal-700">Weekly Availability</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {days.map((day) => (
                                        <div key={day} className="border p-3 rounded-lg">
                                            <p className="capitalize font-semibold mb-2">{day}</p>
                                            <div className="flex gap-3 flex-wrap">
                                                {timeBlocks.map((block) => (
                                                    <label key={block} className="flex items-center gap-1 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={volunteer.availability?.[day]?.includes(block) || false}
                                                            onChange={(e) => {
                                                                setVolunteer((prev) => {
                                                                    const newAvailability = { ...(prev.availability || {}) };
                                                                    const slots = newAvailability[day] || [];
                                                                    if (e.target.checked) {
                                                                        newAvailability[day] = [...slots, block];
                                                                    } else {
                                                                        newAvailability[day] = slots.filter((s) => s !== block);
                                                                    }
                                                                    return { ...prev, availability: newAvailability };
                                                                });
                                                            }}
                                                        />
                                                        {block}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Max Hours per Week */}
                        {availabilityMode === "hours" && (
                            <div className="mt-4">
                                <label className="block mb-1">Max Hours per Week</label>
                                <input
                                    type="number"
                                    value={volunteer.max_hours_per_week || ""}
                                    onChange={(e) =>
                                        setVolunteer((prev) => ({
                                            ...prev,
                                            max_hours_per_week: parseInt(e.target.value) || 0,
                                        }))
                                    }
                                    className="w-full p-3 border rounded"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Skills with Levels */}
                        <label>Skills</label>
                        <Select
                            isMulti
                            options={skillOptions}
                            value={selectedSkills}
                            onChange={handleSkillsChange} />
                        {selectedSkills.map((s) => (
                            <div key={s.value} className="mt-2">
                                <label className="block text-sm font-medium">{s.label} - Experience Level</label>
                                <select
                                    value={skillLevels[s.value] || "beginner"}
                                    onChange={(e) => handleSkillLevelChange(s.value, e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                        ))}

                        {/* Causes */}
                        <label>Causes</label>
                        <Select
                            isMulti
                            options={causeOptions}
                            value={selectedCauses}
                            onChange={handleCausesChange}
                        />
                    </div>

                    <div className="col-span-2 flex justify-center mt-6">
                        <button type="submit" className="px-12 py-4 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-700">
                            Save Profile
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default VolunteerProfile;
