import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
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

const VolunteerViewTask: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useRef<Toast>(null);
    const reasons = (location.state as any)?.reasons || [];

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "TBD";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    useEffect(() => {
        fetch(`http://localhost:8000/api/tasks/${id}`)
            .then(res => res.json())
            .then(data => {
                const parsedTask: Task = {
                    ...data,
                    required_skills: Array.isArray(data.required_skills)
                        ? data.required_skills
                        : JSON.parse(data.required_skills || "[]"),
                    cause: data.cause || null,
                };
                setTask(parsedTask);
            })
            .catch(err => console.error("Error fetching task:", err));
    }, [id]);

    const handleApply = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const payload = { user_id: user.id, task_id: task?.id };
            const response = await fetch("http://localhost:8000/api/task-applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to apply");
            }


            toast.current?.show({
                severity: "success",
                summary: "Applied Successfully!",
                detail: `You've applied for "${task?.title}"`,
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

            setShowConfirm(false);
            setTimeout(() => navigate("/dashboard/volunteer"), 2000);
        } catch (error: any) {

            toast.current?.show({
                severity: "error",
                summary: "Application Failed",
                detail: error.message || "Something went wrong. Please try again.",
                life: 5000,
                className: "w-full max-w-md shadow-2xl",
                pt: {
                    root: {
                        className: "bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl overflow-hidden border-0"
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
                        <i className="pi pi-times text-4xl text-white"></i>
                    </div>
                ),
                style: {
                    animation: "toastSlideIn 0.6s ease-out",
                }
            });
        }
    };

    if (!task) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-7xl text-teal-600 mb-8"></i>
                    <p className="text-3xl font-bold text-gray-700">Loading opportunity...</p>
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
            <Toast
                ref={toast}
                position="top-right"
                pt={{
                    root: { className: "mt-20" },
                    message: { className: "w-full max-w-md" }
                }}
            />

            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-20 left-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-32 right-32 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600/10 to-emerald-600/10 p-10 md:p-14">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="max-w-4xl">
                                <h1 className="text-5xl md:text-6xl font-black text-teal-900 leading-tight">
                                    {task.title}
                                </h1>
                                <p className="text-2xl text-gray-700 mt-4 font-medium flex items-center gap-3">
                                    <i className="pi pi-sparkles text-emerald-600"></i>
                                    Make a real difference
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

                    <div className="p-10 md:p-14">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-10">
                                {/* Description */}
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200/80 shadow-inner">
                                    <h3 className="text-2xl font-bold text-teal-800 mb-5 flex items-center gap-3">
                                        <i className="pi pi-file-text text-teal-600"></i> About This Opportunity
                                    </h3>
                                    <p className="text-gray-700 text-lg leading-relaxed">{task.description}</p>
                                </div>

                                {/* Date & Location */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl p-7 border border-gray-200/70 shadow-md text-center">
                                        <p className="text-gray-600 font-medium mb-2">Start Date</p>
                                        <p className="text-2xl font-bold text-teal-700">{formatDate(task.start_date)}</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-7 border border-gray-200/70 shadow-md text-center">
                                        <p className="text-gray-600 font-medium mb-2">End Date</p>
                                        <p className="text-2xl font-bold text-teal-700">{formatDate(task.end_date)}</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-7 border border-gray-200/70 shadow-md">
                                    <p className="text-gray-600 font-medium mb-2">Location</p>
                                    <p className="text-2xl font-bold text-teal-700 flex items-center gap-3">
                                        <i className="pi pi-map-marker text-teal-600"></i>
                                        {task.location || "Remote / Flexible"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-10">
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
                                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-10 border border-teal-200/70 text-center">
                                    <p className="text-2xl font-bold text-teal-800 mb-4">Volunteers Needed</p>
                                    <p className="text-8xl font-black text-teal-700">{task.volunteers_needed}</p>
                                </div>
                            </div>
                        </div>

                        {/* Match Reasons */}
                        {reasons.length > 0 && (
                            <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-10 border-2 border-emerald-300">
                                <h3 className="text-4xl font-black text-center text-emerald-800 mb-10">
                                    Why You're a Perfect Match
                                </h3>
                                <div className="space-y-6 max-w-4xl mx-auto">
                                    {reasons.map((r: string, i: number) => (
                                        <div key={i} className="flex items-center gap-6 bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border border-emerald-200">
                                            <div className="text-5xl text-emerald-600">Check</div>
                                            <p className="text-xl font-medium text-gray-800 leading-relaxed">{r}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-8 justify-center mt-16">
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="group relative px-24 py-8 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-3xl rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-4">
                                    <i className="pi pi-send"></i> Apply Now
                                </span>
                                <div className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                            </button>

                            <button
                                onClick={() => navigate("/dashboard/volunteer")}
                                className="px-20 py-8 bg-white border-4 border-gray-300 text-gray-800 font-bold text-2xl rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transform hover:-translate-y-2 transition-all duration-300"
                            >
                                Back to Opportunities
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                visible={showConfirm}
                onHide={() => setShowConfirm(false)}
                header={
                    // Fixed: Solid background + proper spacing + prevents overlap
                    <div className="bg-white rounded-t-3xl px-10 py-10 text-center shadow-lg relative">
                        <h2 className="text-5xl font-black text-teal-900 leading-tight">
                            Ready to Make an Impact?
                        </h2>
                    </div>
                }
                className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-0"
                contentClassName="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 pt-0"
                closeOnEscape
                dismissableMask
                modal
                blockScroll
                appendTo="self"
                pt={{

                    closeButton: {
                        className: "absolute top-6 right-6 w-14 h-14 bg-white/95 backdrop-blur-lg rounded-full shadow-2xl flex items-center justify-center text-teal-700 hover:bg-teal-100 hover:text-teal-800 hover:scale-110 transition-all duration-300 border-4 border-teal-200 z-50"
                    },
                    closeButtonIcon: {
                        className: "text-3xl font-bold"
                    },

                    header: {
                        className: "border-0 p-0"
                    }
                }}
            >
                <div className="p-10 text-center space-y-10 -mt-6">
                    <i className="pi pi-heart-fill text-9xl text-teal-600 animate-pulse"></i>

                    <div className="space-y-6">
                        <p className="text-2xl font-bold text-gray-800">You're applying for:</p>
                        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 leading-tight px-4">
                            {task.title}
                        </p>
                    </div>

                    <p className="text-xl text-gray-700 max-w-xl mx-auto leading-relaxed">
                        The nonprofit will review your profile and get back to you soon.
                        <br />
                        <span className="font-bold text-teal-700">This is your chance to create real change.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                        <Button
                            label="Cancel"
                            onClick={() => setShowConfirm(false)}
                            className="px-16 py-7 bg-white border-4 border-gray-300 text-gray-800 font-bold text-2xl rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg"
                        />
                        <Button
                            label="Confirm & Apply"
                            onClick={handleApply}
                            icon="pi pi-send"
                            className="px-20 py-7 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-3xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default VolunteerViewTask;