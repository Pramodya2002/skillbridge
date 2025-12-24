import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";

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

const NonprofitTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();

    const fetchTasks = () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            console.error("No auth token found. Please log in again.");
            return;
        }

        fetch("http://localhost:8000/api/tasks", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        alert("Session expired. Please log in again.");
                        localStorage.removeItem("token");
                        navigate("/login");
                    }
                    throw new Error("Failed to fetch tasks");
                }
                return res.json();
            })
            .then((response) => {
                setTasks(response.data ?? []);
            })
            .catch((err) => {
                console.error("Error fetching tasks:", err);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const statusTemplate = (row: Task) => {
        const statusConfig: Record<Task["status"], { label: string; gradient: string; glow: string }> = {
            Open: { label: "Open", gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/60" },
            Ongoing: { label: "In Progress", gradient: "from-blue-500 to-cyan-600", glow: "shadow-blue-500/60" },
            Completed: { label: "Completed", gradient: "from-purple-500 to-pink-600", glow: "shadow-purple-500/60" },
        };

        const config = statusConfig[row.status] || { label: row.status, gradient: "from-gray-500 to-gray-600", glow: "shadow-gray-500/60" };

        return (
            <div className="flex justify-center">
                <Tag
                    value={config.label}
                    className={`px-5 py-2.5 sm:px-6 sm:py-3 text-base sm:text-lg font-bold rounded-full bg-gradient-to-r ${config.gradient} text-white shadow-lg ${config.glow} transform hover:scale-105 transition-all duration-300`}
                />
            </div>
        );
    };

    const actionTemplate = (row: Task) => (
        <div className="flex justify-center">
            <button
                onClick={() => navigate(`/dashboard/nonprofit/tasks/${row.id}`)}
                className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    <i className="pi pi-eye text-lg sm:text-xl"></i>
                    View Task
                </span>
                <div className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-2xl"></div>
            </button>
        </div>
    );

    return (
        <div className="min-h-screen space-y-12 py-8 px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-teal-800 mb-4">
                    Manage Opportunities
                </h1>
                <p className="text-lg sm:text-2xl text-gray-700 font-medium max-w-4xl mx-auto">
                    Create, track, and manage all volunteer opportunities for your organization
                </p>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
                <div className="text-left">
                    <p className="text-base sm:text-lg text-gray-600">
                        Total Active Opportunities: <span className="font-bold text-teal-700">{tasks.length}</span>
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button
                        label="Refresh List"
                        icon="pi pi-refresh"
                        onClick={fetchTasks}
                        className="px-8 py-4 bg-white border-2 border-teal-600 text-teal-700 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-teal-50 transition-all duration-300 w-full sm:w-auto"
                    />
                    <Button
                        label="Create New Opportunity"
                        icon="pi pi-plus-circle"
                        onClick={() => navigate("/dashboard/nonprofit/create-task")}
                        className="px-10 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-lg sm:text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="lg:hidden text-center text-sm text-gray-500 mb-4">
                            ← Scroll horizontally to view all columns →
                        </div>

                        <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
                            <DataTable
                                value={tasks}
                                emptyMessage={
                                    <div className="text-center py-16 sm:py-20">
                                        <i className="pi pi-briefcase text-7xl sm:text-9xl text-gray-300 mb-8"></i>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-500">No opportunities yet</p>
                                        <p className="text-lg sm:text-xl text-gray-400 mt-4">Click "Create New Opportunity" to get started</p>
                                    </div>
                                }
                                className="rounded-2xl overflow-hidden"
                                stripedRows
                                rowHover
                                tableStyle={{ minWidth: "50rem" }}
                                scrollable
                                scrollHeight="flexible"
                            >
                                {/* Task Title */}
                                <Column
                                    field="title"
                                    header="Opportunity Title"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-left font-semibold text-gray-800 text-sm sm:text-base border-r border-gray-200"
                                    body={(row) => <span className="text-teal-700">{row.title}</span>}
                                    style={{ minWidth: "260px", width: "30%" }}
                                />

                                {/* Location */}
                                <Column
                                    field="location"
                                    header="Location"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center text-gray-700 text-sm sm:text-base border-r border-gray-200"
                                    body={(row) => row.location || "Remote"}
                                    style={{ minWidth: "120px", width: "15%" }}
                                />

                                {/* End Date */}
                                <Column
                                    field="end_date"
                                    header="Application Deadline"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center font-bold text-teal-700 text-sm sm:text-base border-r border-gray-200"
                                    body={(row) => formatDate(row.end_date)}
                                    style={{ minWidth: "140px", width: "15%" }}
                                />

                                {/* Volunteers Needed */}
                                <Column
                                    field="volunteers_needed"
                                    header="Volunteers Needed"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center font-bold text-emerald-600 text-sm sm:text-base border-r border-gray-200"
                                    body={(row) => (
                                        <div className="inline-flex items-center gap-2">
                                            <i className="pi pi-users"></i>
                                            {row.volunteers_needed}
                                        </div>
                                    )}
                                    style={{ minWidth: "140px", width: "12%" }}
                                />

                                {/* Applications */}
                                <Column
                                    field="applications_count"
                                    header="Applications"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center font-bold text-purple-700 text-sm sm:text-base border-r border-gray-200"
                                    body={(row) => row.applications_count ?? 0}
                                    style={{ minWidth: "100px", width: "10%" }}
                                />

                                {/* Status */}
                                <Column
                                    field="status"
                                    header="Status"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 border-r border-gray-200"
                                    body={statusTemplate}
                                    style={{ minWidth: "160px", width: "12%" }}
                                />

                                {/* Action */}
                                <Column
                                    header="Action"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center"
                                    body={actionTemplate}
                                    style={{ minWidth: "160px", width: "16%" }}
                                />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-32 left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-15 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-15 animate-pulse delay-1000"></div>
            </div>
        </div>
    );
};

export default NonprofitTasks;