import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";

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
    const [applicationId, setApplicationId] = useState<number | null>(null);

    const navigate = useNavigate();

    const toast = useRef<Toast>(null);

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

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const volunteerId = user?.volunteer_id || user?.id;

        if (!volunteerId || !task) return;

        fetch(`http://localhost:8000/api/volunteers/${volunteerId}/tasks`)
            .then(res => res.json())
            .then((applied: any[]) => {
                const appliedTask = applied.find(a => a.task_id === task.id);
                if (appliedTask) {
                    setApplicationId(appliedTask.id);
                }
            })
            .catch(console.error);
    }, [task]);

    const handleWithdraw = async () => {
        if (!applicationId) return;

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const volunteerId = user?.volunteer_id || user?.id;

        if (!volunteerId) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "User information not found. Please refresh the page.",
                life: 5000,
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/task-applications/${applicationId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ volunteer_id: volunteerId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to withdraw");
            }

            toast.current?.show({
                severity: "success",
                summary: "Success!",
                detail: "Your application has been withdrawn.",
                life: 5000,
            });

            setApplicationId(null);
            setTimeout(() => navigate("/dashboard/volunteer/tasks"), 2000);
        } catch (error: any) {
            toast.current?.show({
                severity: "error",
                summary: "Failed",
                detail: error.message || "Could not withdraw application.",
                life: 6000,
            });
        }
    };
    if (!task) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-6xl sm:text-7xl text-teal-600 mb-6"></i>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-700">Loading your opportunity...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
            <Toast
                ref={toast}
                position="top-right"
                className="z-50"
                pt={{
                    root: {
                        className: "fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-lg mx-4 sm:mx-6 md:mx-8 shadow-2xl z-50"
                    },
                    message: {
                        className: "w-full rounded-xl border-l-8 border-l-teal-500"
                    },
                    content: {
                        className: "p-5 sm:p-6 bg-white/95 backdrop-blur-md rounded-xl shadow-lg"
                    },
                    summary: {
                        className: "font-bold text-xl sm:text-2xl text-gray-900"
                    },
                    detail: {
                        className: "text-gray-700 mt-2 text-base sm:text-lg"
                    },
                    closeButton: {
                        className: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    },
                    icon: {
                        className: "text-3xl sm:text-4xl"
                    }
                }}
            />
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-20 left-20 w-80 sm:w-96 h-80 sm:h-96 bg-teal-400 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-32 right-32 w-72 sm:w-80 h-72 sm:h-80 bg-emerald-500 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-600/10 to-emerald-600/10 p-8 sm:p-10 md:p-12">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8">
                            <div className="max-w-4xl">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-teal-900 leading-tight">
                                    {task.title}
                                </h1>
                                <p className="text-xl sm:text-2xl text-gray-700 mt-4 font-medium flex items-center gap-3">
                                    <i className="pi pi-check-circle text-emerald-600"></i>
                                    You have applied to this opportunity
                                </p>
                            </div>

                            <div className="relative flex-shrink-0">
                                <Tag
                                    value={status.label}
                                    className={`px-6 sm:px-10 py-4 sm:py-5 text-xl sm:text-2xl font-black text-white rounded-full bg-gradient-to-r ${status.gradient} shadow-2xl ${status.glow} animate-pulse`}
                                />
                                <div className="absolute inset-0 rounded-full bg-white/40 blur-2xl animate-ping"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-10 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-inner">
                                    <h3 className="text-xl sm:text-2xl font-bold text-teal-800 mb-4 sm:mb-5 flex items-center gap-3">
                                        <i className="pi pi-file-text text-teal-600"></i> Description
                                    </h3>
                                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">{task.description}</p>
                                </div>

                                {/* Location & Period */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/70 shadow-md">
                                        <h4 className="text-base sm:text-lg font-bold text-gray-600 mb-2">Location</h4>
                                        <p className="text-xl sm:text-2xl font-bold text-teal-700 flex items-center gap-3">
                                            <i className="pi pi-map-marker text-teal-600"></i>
                                            {task.location || "Remote"}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/70 shadow-md">
                                        <h4 className="text-base sm:text-lg font-bold text-gray-600 mb-4 text-center">Task Period</h4>

                                        <div className="flex items-center justify-center gap-3">
                                            {/* Start Date */}
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Start</p>
                                                <p className="text-sm sm:text-base font-bold text-teal-700 leading-tight">
                                                    {formatDate(task.start_date)}
                                                </p>
                                            </div>

                                            <div className="text-xl sm:text-2xl text-gray-400 flex-shrink-0">
                                                ➡️
                                            </div>

                                            {/* End Date */}
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">End</p>
                                                <p className="text-sm sm:text-base font-bold text-teal-700 leading-tight">
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
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-purple-200/50">
                                        <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-5 sm:mb-6 flex items-center gap-3">
                                            <i className="pi pi-star-fill text-purple-600"></i> Required Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                                            {task.required_skills.map((s, i) => (
                                                <div
                                                    key={i}
                                                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base flex flex-col items-center"
                                                >
                                                    <span className="block break-words text-center leading-tight">{s.skill}</span>
                                                    <span className="opacity-90 text-xs sm:text-sm mt-1">({s.level})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Cause Area */}
                                {task.cause && (
                                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-pink-200/50 text-center">
                                        <h3 className="text-xl sm:text-2xl font-bold text-pink-800 mb-4 flex items-center justify-center gap-3">
                                            <i className="pi pi-heart-fill text-pink-600"></i> Cause Area
                                        </h3>
                                        <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 break-words px-4">
                                            {task.cause}
                                        </p>
                                    </div>
                                )}

                                {/* Volunteers Needed */}
                                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-200/70 text-center">
                                    <h3 className="text-xl sm:text-2xl font-bold text-teal-800 mb-4">Volunteers Needed</h3>
                                    <p className="text-6xl sm:text-7xl font-black text-teal-700">{task.volunteers_needed}</p>
                                </div>

                                {/* Posted On */}
                                {task.created_at && (
                                    <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-200">
                                        <i className="pi pi-calendar text-gray-400"></i>
                                        <span className="text-gray-600 font-medium text-sm sm:text-base">
                                            Posted on <span className="font-bold text-teal-700">{formatDate(task.created_at)}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="flex justify-center mt-12">

                            {applicationId && (
                                <button
                                    onClick={handleWithdraw}
                                    className="group relative px-16 sm:px-20 py-5 sm:py-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold text-xl sm:text-2xl rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3 sm:gap-4">
                                        <i className="pi pi-trash"></i> Withdraw Application
                                    </span>
                                    <div className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full"></div>
                                </button>
                            )}
                            <button
                                onClick={() => navigate("/dashboard/volunteer/tasks")}
                                className="group relative px-16 sm:px-20 py-5 sm:py-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xl sm:text-2xl rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-3 sm:gap-4">
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