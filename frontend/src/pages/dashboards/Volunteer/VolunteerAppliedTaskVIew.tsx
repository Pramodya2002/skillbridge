import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag } from "primereact/tag";

interface Skill {
    skill: string;
    level: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    required_skills?: Skill[];
    cause?: string | null;
    volunteers_needed: number;
    status: string;
    created_at?: string;
}

const VolunteerAppliedTaskView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const navigate = useNavigate();

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    useEffect(() => {
        fetch(`http://localhost:8000/api/tasks/${id}`)
            .then((res) => res.json())
            .then((data) => {
                const parsedTask: Task = {
                    ...data,
                    required_skills: Array.isArray(data.required_skills)
                        ? data.required_skills
                        : JSON.parse(data.required_skills || "[]"),
                };
                setTask(parsedTask);
            })
            .catch((err) => console.error("Error fetching task details:", err));
    }, [id]);

    if (!task) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-7xl text-teal-600 mb-6"></i>
                    <p className="text-3xl font-bold text-gray-700">Loading your opportunity...</p>
                </div>
            </div>
        );
    }

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case "open": return { label: "Open for Applications", gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/60" };
            case "ongoing": return { label: "In Progress", gradient: "from-blue-500 to-cyan-600", glow: "shadow-blue-500/60" };
            case "completed": return { label: "Completed", gradient: "from-purple-500 to-pink-600", glow: "shadow-purple-500/60" };
            default: return { label: status, gradient: "from-gray-500 to-gray-600", glow: "shadow-gray-500/60" };
        }
    };

    const status = getStatusConfig(task.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-12 px-6 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-20 left-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-32 right-32 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-600/10 to-emerald-600/10 p-8 md:p-12">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="max-w-4xl">
                                <h1 className="text-5xl md:text-6xl font-black text-teal-900 leading-tight">
                                    {task.title}
                                </h1>
                                <p className="text-2xl text-gray-700 mt-4 font-medium flex items-center gap-3">
                                    <i className="pi pi-check-circle text-emerald-600"></i>
                                    You have applied to this opportunity
                                </p>
                            </div>

                            <div className="relative">
                                <Tag
                                    value={status.label}
                                    className={`px-10 py-5 text-2xl font-black text-white rounded-full bg-gradient-to-r ${status.gradient} shadow-2xl ${status.glow} animate-pulse`}
                                />
                                <div className="absolute inset-0 rounded-full bg-white/40 blur-2xl animate-ping"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200/80 shadow-inner">
                                    <h3 className="text-2xl font-bold text-teal-800 mb-5 flex items-center gap-3">
                                        <i className="pi pi-file-text text-teal-600"></i> Description
                                    </h3>
                                    <p className="text-gray-700 text-lg leading-relaxed">{task.description}</p>
                                </div>

                                {/* Location & Period */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl p-7 border border-gray-200/70 shadow-md">
                                        <h4 className="text-lg font-bold text-gray-600 mb-2">Location</h4>
                                        <p className="text-2xl font-bold text-teal-700 flex items-center gap-3">
                                            <i className="pi pi-map-marker text-teal-600"></i>
                                            {task.location || "Remote"}
                                        </p>
                                    </div>


                                    <div className="bg-white rounded-2xl p-6 border border-gray-200/70 shadow-md">
                                        <h4 className="text-lg font-bold text-gray-600 mb-4 text-center">Task Period</h4>

                                        <div className="flex items-center justify-center gap-3">
                                            {/* Start Date */}
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Start</p>
                                                <p className="text-sm md:text-base font-bold text-teal-700 leading-tight">
                                                    {formatDate(task.start_date)}
                                                </p>
                                            </div>


                                            <div className="text-2xl text-gray-400 flex-shrink-0">
                                                ➡️
                                            </div>

                                            {/* End Date */}
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">End</p>
                                                <p className="text-sm md:text-base font-bold text-teal-700 leading-tight">
                                                    {formatDate(task.end_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Required Skills */}
                                {task.required_skills && task.required_skills.length > 0 && (
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200/50">
                                        <h3 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-3">
                                            <i className="pi pi-star-fill text-purple-600"></i> Required Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            {task.required_skills.map((s, i) => (
                                                <div
                                                    key={i}
                                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                                >
                                                    {s.skill} <span className="opacity-90">({s.level})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Cause Area */}
                                {task.cause && (
                                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-200/50">
                                        <h3 className="text-2xl font-bold text-pink-800 mb-4 flex items-center gap-3">
                                            <i className="pi pi-heart-fill text-pink-600"></i> Cause Area
                                        </h3>
                                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                                            {task.cause}
                                        </p>
                                    </div>
                                )}

                                {/* Volunteers Needed */}
                                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-200/70 text-center">
                                    <h3 className="text-2xl font-bold text-teal-800 mb-4">Volunteers Needed</h3>
                                    <p className="text-7xl font-black text-teal-700">{task.volunteers_needed}</p>
                                </div>

                                {/* Posted On */}
                                {task.created_at && (
                                    <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-200">
                                        <i className="pi pi-calendar text-gray-400"></i>
                                        <span className="text-gray-600 font-medium">
                                            Posted on <span className="font-bold text-teal-700">{formatDate(task.created_at)}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={() => navigate("/dashboard/volunteer/tasks")}
                                className="group relative px-20 py-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-2xl rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-4">
                                    <i className="pi pi-arrow-left"></i> Back to My Tasks
                                </span>
                                <div className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerAppliedTaskView;