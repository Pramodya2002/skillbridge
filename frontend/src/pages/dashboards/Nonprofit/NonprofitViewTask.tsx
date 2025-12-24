import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface Volunteer {
    id: number;
    user?: {
        name: string;
        email: string;
        phone?: string;
    };
    skills?: { skill: string; level: string }[];
    availability?: string | Record<string, boolean>;
    experience?: string;
}

interface Application {
    id: number;
    status: "applied" | "accepted" | "rejected";
    volunteer: Volunteer;
}

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
    cause?: string | null;
    required_skills: Skill[];
    volunteers_needed: number;
    status: "Open" | "Ongoing" | "Completed";
    applications_count?: number;
}

const NonprofitViewTask: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const [taskRes, appsRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/tasks/${id}`),
                    fetch(`http://localhost:8000/api/tasks/${id}/applications`)
                ]);

                const taskData = await taskRes.json();
                const appsData = await appsRes.json();

                setTask(taskData);
                setApplications(appsData);
            } catch (err) {
                console.error("Error loading task:", err);
            }
        };

        fetchTask();
    }, [id]);

    const updateApplicationStatus = async (appId: number, status: "accepted" | "rejected") => {
        try {
            await fetch(`http://localhost:8000/api/task-applications/${appId}/update-status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            setApplications(prev =>
                prev.map(app =>
                    app.id === appId ? { ...app, status } : app
                )
            );

            toast.current?.show({
                severity: status === "accepted" ? "success" : "warn",
                summary: status === "accepted" ? "Volunteer Accepted!" : "Application Rejected",
                detail: status === "accepted"
                    ? "The volunteer has been added to your team."
                    : "The application has been rejected.",
                life: 4000,
            });
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Action Failed",
                detail: "Could not update application status.",
                life: 4000,
            });
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusConfig = (status: Task["status"]) => {
        const configs: Record<Task["status"], { label: string; gradient: string; glow: string }> = {
            Open: { label: "Open for Applications", gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/60" },
            Ongoing: { label: "In Progress", gradient: "from-blue-500 to-cyan-600", glow: "shadow-blue-500/60" },
            Completed: { label: "Completed", gradient: "from-purple-500 to-pink-600", glow: "shadow-purple-500/60" },
        };
        return configs[status] || configs.Open;
    };

    if (!task) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-6xl sm:text-7xl text-teal-600 mb-6"></i>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-700">Loading opportunity details...</p>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(task.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
            <Toast ref={toast} position="top-right" />

            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-20 left-20 w-80 sm:w-96 h-80 sm:h-96 bg-teal-400 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-32 right-32 w-72 sm:w-80 h-72 sm:h-80 bg-emerald-500 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 leading-tight break-words px-4">
                        {task.title}
                    </h1>
                    <div className="mt-6 inline-flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Tag
                            value={statusConfig.label}
                            className={`px-6 sm:px-8 py-3 sm:py-4 text-xl sm:text-2xl font-black text-white rounded-full bg-gradient-to-r ${statusConfig.gradient} shadow-2xl ${statusConfig.glow} transform hover:scale-105 transition-all duration-300`}
                        />
                        <div className="text-2xl sm:text-3xl font-bold text-gray-700">
                            {applications.length} / {task.volunteers_needed} Volunteers
                        </div>
                    </div>
                </div>

                {/* Task Details Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 mb-12 sm:mb-16">
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10">
                            <h2 className="text-3xl sm:text-4xl font-black text-teal-800 mb-8 flex items-center gap-4">
                                Opportunity Details
                            </h2>

                            <div className="space-y-8 text-base sm:text-lg">
                                <div className="flex flex-col sm:flex-row items-start gap-5">
                                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                                        <i className="pi pi-file-text text-3xl text-white"></i>
                                    </div>
                                    <div>
                                        <p className="font-bold text-teal-700 text-xl">Description</p>
                                        <p className="text-gray-700 mt-2 leading-relaxed">{task.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                                            <i className="pi pi-map-marker text-3xl text-white"></i>
                                        </div>
                                        <div>
                                            <p className="font-bold text-purple-700">Location</p>
                                            <p className="text-gray-700">{task.location || "Remote / Flexible"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                                            <i className="pi pi-calendar text-3xl text-white"></i>
                                        </div>
                                        <div>
                                            <p className="font-bold text-amber-700">Timeline</p>
                                            <p className="text-gray-700 break-words">
                                                {formatDate(task.start_date)} → {formatDate(task.end_date)}
                                            </p>
                                        </div>
                                    </div>

                                    {task.cause && (
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                                                <i className="pi pi-heart text-3xl text-white"></i>
                                            </div>
                                            <div>
                                                <p className="font-bold text-pink-700">Cause Area</p>
                                                <p className="text-gray-700 capitalize">{task.cause.replace(/-/g, " ")}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                                            <i className="pi pi-wrench text-3xl text-white"></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-cyan-700">Required Skills</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {task.required_skills.length > 0 ? (
                                                    task.required_skills.map((s, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 font-bold rounded-full text-sm border border-teal-300"
                                                        >
                                                            {s.skill.replace(/-/g, " ")} <span className="text-emerald-700">({s.level})</span>
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 italic">No specific skills required</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Applications Summary */}
                    <div className="space-y-6">
                        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                                <i className="pi pi-users text-5xl sm:text-6xl text-white"></i>
                            </div>
                            <p className="text-5xl sm:text-6xl font-black text-teal-700 mt-6">{applications.length}</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-700">Applications</p>
                            <p className="text-base sm:text-lg text-gray-600 mt-2">
                                Out of <strong>{task.volunteers_needed}</strong> needed
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/dashboard/nonprofit/tasks")}
                            className="w-full py-5 sm:py-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-black text-xl sm:text-2xl rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                        >
                            ← Back to All Opportunities
                        </button>
                    </div>
                </div>

                {/* Volunteer Applications */}
                <div>
                    <h2 className="text-4xl sm:text-5xl font-black text-center text-teal-800 mb-10 sm:mb-12">
                        Volunteer Applications
                    </h2>

                    {applications.length === 0 ? (
                        <div className="text-center py-16 sm:py-20 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl">
                            <i className="pi pi-inbox text-7xl sm:text-9xl text-gray-300 mb-8"></i>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-500">No applications yet</p>
                            <p className="text-lg sm:text-xl text-gray-400 mt-4">Volunteers will appear here once they apply</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="group relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden hover:shadow-3xl transform hover:-translate-y-4 transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="p-6 sm:p-8 relative z-10">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                            <h3 className="text-xl sm:text-2xl font-black text-teal-800 break-words">
                                                {app.volunteer?.user?.name || "Anonymous Volunteer"}
                                            </h3>
                                            <Tag
                                                value={app.status.toUpperCase()}
                                                className={`px-4 sm:px-5 py-2 text-base sm:text-lg font-bold rounded-full shadow-lg
                                                    ${app.status === "applied" ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-blue-500/50" :
                                                        app.status === "accepted" ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/50" :
                                                            "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/50"
                                                    }`}
                                            />
                                        </div>

                                        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
                                            {app.volunteer?.user?.email && (
                                                <p className="flex items-center gap-3 break-words">
                                                    <i className="pi pi-envelope text-teal-600"></i>
                                                    <span className="font-medium">{app.volunteer.user.email}</span>
                                                </p>
                                            )}
                                            {app.volunteer?.user?.phone && (
                                                <p className="flex items-center gap-3">
                                                    <i className="pi pi-phone text-emerald-600"></i>
                                                    <span>{app.volunteer.user.phone}</span>
                                                </p>
                                            )}
                                            {app.volunteer?.experience && (
                                                <p className="text-sm italic text-gray-600">
                                                    "{app.volunteer.experience}"
                                                </p>
                                            )}
                                        </div>

                                        {app.volunteer?.skills && app.volunteer.skills.length > 0 && (
                                            <div className="mt-6">
                                                <p className="font-bold text-teal-700 mb-3">Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {app.volunteer.skills.map((s, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 font-bold rounded-full text-xs sm:text-sm border border-teal-300"
                                                        >
                                                            {s.skill.replace(/-/g, " ")} ({s.level})
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                            {app.status !== "accepted" && (
                                                <button
                                                    onClick={() => updateApplicationStatus(app.id, "accepted")}
                                                    className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base sm:text-lg"
                                                >
                                                    Accept
                                                </button>
                                            )}
                                            {app.status !== "rejected" && app.status !== "accepted" && (
                                                <button
                                                    onClick={() => updateApplicationStatus(app.id, "rejected")}
                                                    className="flex-1 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base sm:text-lg"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl scale-0 group-hover:scale-150 transition-transform duration-700 -z-10"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NonprofitViewTask;