import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useRef } from "react";

type OptionType = { value: string; label: string };
type SkillWithLevel = { skill: string; level: string };

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

const levelOptions: OptionType[] = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" },
];

const statuses = [
    { label: "Open for Applications", value: "Open" },
    { label: "In Progress", value: "Ongoing" },
    { label: "Completed", value: "Completed" },
];

const NonprofitCreateTask: React.FC = () => {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [requiredSkills, setRequiredSkills] = useState<SkillWithLevel[]>([]);
    const [selectedSkill, setSelectedSkill] = useState<OptionType | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<OptionType | null>(null);
    const [cause, setCause] = useState<OptionType | null>(null);
    const [volunteersNeeded, setVolunteersNeeded] = useState<number | "">("");
    const [status, setStatus] = useState("Open");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const addSkill = () => {
        if (selectedSkill && selectedLevel) {
            setRequiredSkills([...requiredSkills, { skill: selectedSkill.value, level: selectedLevel.value }]);
            setSelectedSkill(null);
            setSelectedLevel(null);
        }
    };

    const removeSkill = (index: number) => {
        setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title || !description || !location || !startDate || !endDate || !volunteersNeeded || volunteersNeeded <= 0) {
            toast.current?.show({
                severity: "warn",
                summary: "Missing Fields",
                detail: "Please fill all required fields correctly.",
                life: 4000,
            });
            return;
        }
        if (endDate < startDate) {
            toast.current?.show({
                severity: "error",
                summary: "Invalid Dates",
                detail: "End date cannot be earlier than start date.",
                life: 4000,
            });
            return;
        }

        const formatDate = (date: Date) => date.toISOString().split("T")[0];

        const newTask = {
            title,
            description,
            location,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            required_skills: requiredSkills,
            cause: cause?.value || null,
            volunteers_needed: Number(volunteersNeeded),
            status,
        };

        try {
            const response = await fetch("http://localhost:8000/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) throw new Error("Failed to create opportunity");

            toast.current?.show({
                severity: "success",
                summary: "Opportunity Created!",
                detail: `"${title}" has been posted successfully!`,
                life: 5000,
                className: "w-full max-w-md shadow-2xl",
                pt: {
                    root: { className: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl overflow-hidden border-0" },
                    icon: { className: "hidden" },
                    summary: { className: "font-black text-xl" },
                    detail: { className: "text-white/90 mt-1" },
                    closeButton: { className: "text-white/70 hover:text-white hover:bg-white/20 rounded-full w-10 h-10" },
                },
                icon: () => (
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white/25 rounded-full mr-5 shadow-xl">
                        <i className="pi pi-sparkles text-4xl text-white"></i>
                    </div>
                ),
            });

            setTimeout(() => navigate("/dashboard/nonprofit/tasks"), 2000);
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Creation Failed",
                detail: "Something went wrong. Please try again.",
                life: 5000,
            });
        }
    };

    const customSelectStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "2px solid rgba(20, 184, 166, 0.4)",
            borderRadius: "1rem",
            padding: "0.75rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            "&:hover": { borderColor: "#14b8a6" },
            fontSize: "1.1rem",
        }),
        placeholder: (base: any) => ({ ...base, color: "#6b7280" }),
        singleValue: (base: any) => ({ ...base, color: "#0f766e", fontWeight: "600" }),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-12 px-6 relative overflow-hidden">
            <Toast ref={toast} position="top-right" pt={{ root: { className: "mt-20" } }} />

            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-20 left-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-32 right-32 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 leading-tight">
                        Post a New Opportunity
                    </h1>
                    <p className="text-2xl text-gray-700 mt-6 font-medium max-w-3xl mx-auto">
                        Inspire volunteers to join your mission. Every opportunity you create changes lives.
                    </p>
                </div>

                <div className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-10 md:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                        {/* LEFT COLUMN */}
                        <div className="space-y-10">
                            {/* Title */}
                            <div className="relative">
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="peer w-full px-8 py-6 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-xl shadow-inner"
                                    placeholder=" "
                                    required
                                />
                                <label className="absolute left-8 -top-4 px-4 bg-white text-lg font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-teal-700 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-500">
                                    Opportunity Title *
                                </label>
                            </div>

                            {/* Description */}
                            <div className="relative">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={7}
                                    className="peer w-full px-8 py-6 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-lg shadow-inner resize-none"
                                    placeholder=" "
                                    required
                                />
                                <label className="absolute left-8 -top-4 px-4 bg-white text-lg font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-teal-700 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-500">
                                    Description *
                                </label>
                            </div>

                            {/* Location + Volunteers Needed */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="relative">
                                    <input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="peer w-full px-8 py-6 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-lg shadow-inner"
                                        placeholder=" "
                                        required
                                    />
                                    <label className="absolute left-8 -top-4 px-4 bg-white text-lg font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-teal-700 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-500">
                                        Location *
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type="number"
                                        value={volunteersNeeded}
                                        onChange={(e) => setVolunteersNeeded(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="peer w-full px-8 py-6 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-lg shadow-inner"
                                        placeholder=" "
                                        min="1"
                                        required
                                    />
                                    <label className="absolute left-8 -top-4 px-4 bg-white text-lg font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-teal-700 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-500">
                                        Volunteers Needed *
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-lg font-bold text-teal-800 mb-3">Start Date *</label>
                                    <Calendar
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.value as Date | null)}
                                        minDate={today}
                                        showIcon
                                        iconPos="left"
                                        dateFormat="M dd, yy"
                                        className="w-full"
                                        inputClassName="w-full h-16 pl-14 pr-6 py-4 text-lg font-medium bg-white/90 border-2 border-gray-300/70 rounded-2xl focus:border-teal-600 shadow-inner"
                                        panelClassName="bg-white/95 backdrop-blur-xl border-2 border-teal-200 rounded-3xl shadow-2xl"
                                        showButtonBar
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-teal-800 mb-3">End Date *</label>
                                    <Calendar
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.value as Date | null)}
                                        minDate={startDate || today}
                                        showIcon
                                        iconPos="left"
                                        dateFormat="M dd, yy"
                                        className="w-full"
                                        inputClassName="w-full h-16 pl-14 pr-6 py-4 text-lg font-medium bg-white/90 border-2 border-gray-300/70 rounded-2xl focus:border-teal-600 shadow-inner"
                                        panelClassName="bg-white/95 backdrop-blur-xl border-2 border-teal-200 rounded-3xl shadow-2xl"
                                        showButtonBar
                                    />
                                </div>
                            </div>

                            {/* Cause Area */}
                            <div>
                                <label className="block text-lg font-bold text-teal-800 mb-3">Cause Area</label>
                                <Select
                                    options={causeOptions}
                                    value={cause}
                                    onChange={(val) => setCause(val as OptionType)}
                                    placeholder="Select a cause..."
                                    styles={customSelectStyles}
                                    className="text-lg"
                                />
                            </div>

                            {/* Required Skills */}
                            <div>
                                <label className="block text-lg font-bold text-teal-800 mb-3">Required Skills</label>
                                <div className="flex gap-4 mb-5">
                                    <Select
                                        options={skillOptions}
                                        value={selectedSkill}
                                        onChange={(val) => setSelectedSkill(val as OptionType)}
                                        placeholder="Skill"
                                        styles={customSelectStyles}
                                        className="flex-1"
                                    />
                                    <Select
                                        options={levelOptions}
                                        value={selectedLevel}
                                        onChange={(val) => setSelectedLevel(val as OptionType)}
                                        placeholder="Level"
                                        styles={customSelectStyles}
                                        className="flex-1"
                                    />
                                    <button
                                        onClick={addSkill}
                                        className="px-10 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {requiredSkills.map((s, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200 shadow-sm"
                                        >
                                            <span className="font-semibold text-teal-800 capitalize">
                                                {s.skill.replace(/-/g, " ")} — <span className="text-emerald-700 font-bold">{s.level}</span>
                                            </span>
                                            <button
                                                onClick={() => removeSkill(i)}
                                                className="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md hover:scale-110 transition"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-lg font-bold text-teal-800 mb-3">Initial Status</label>
                                <Dropdown
                                    value={status}
                                    options={statuses}
                                    onChange={(e) => setStatus(e.value)}
                                    placeholder="Open for Applications"
                                    className="w-full h-16"
                                    inputId="status-dropdown"
                                    pt={{
                                        root: { className: "h-full" },
                                        input: { className: "w-full h-full pl-6 pr-12 py-4 text-lg font-medium bg-white/90 border-2 border-gray-300/70 rounded-2xl focus:border-teal-600 shadow-inner" },
                                        trigger: { className: "text-teal-600" },
                                        panel: { className: "bg-white/95 backdrop-blur-xl border-2 border-teal-200 rounded-3xl shadow-2xl mt-2" },
                                        item: { className: "py-4 px-6 hover:bg-teal-50" },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-10 mt-16">
                        <button
                            onClick={() => navigate("/dashboard/nonprofit/tasks")}
                            className="px-16 py-6 bg-white border-4 border-gray-300 text-gray-700 font-black text-2xl rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transform hover:-translate-y-1 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="group relative px-24 py-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-3xl rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-5">
                                <i className="pi pi-send text-4xl"></i>
                                Post Opportunity
                            </span>
                            <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NonprofitCreateTask;