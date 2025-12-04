import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";

interface TaskApplication {
    id: number;
    status: string;
    task: {
        id: number;
        title: string;
        location: string;
        end_date: string;
    };
}

const VolunteerTasks: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const volunteerId = user?.volunteer_id || user?.id;
    const [tasks, setTasks] = useState<TaskApplication[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!volunteerId) return;

        fetch(`http://localhost:8000/api/volunteers/${volunteerId}/tasks`)
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error("Error fetching volunteer tasks:", err));
    }, [volunteerId]);

    const statusTemplate = (row: TaskApplication) => {
        const statusConfig: Record<string, { label: string; gradient: string; glow: string }> = {
            completed: { label: "Completed", gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/50" },
            applied: { label: "Applied", gradient: "from-blue-500 to-cyan-600", glow: "shadow-blue-500/50" },
            pending: { label: "Pending", gradient: "from-amber-500 to-orange-600", glow: "shadow-amber-500/50" },
        };

        const config = statusConfig[row.status] || { label: row.status, gradient: "from-gray-500 to-gray-600", glow: "shadow-gray-500/50" };

        return (
            <div className="flex justify-center">
                <Tag
                    value={config.label}
                    className={`px-6 py-3 text-white font-bold text-lg rounded-full bg-gradient-to-r ${config.gradient} shadow-lg ${config.glow} transform hover:scale-105 transition-all duration-300`}
                />
            </div>
        );
    };

    const actionTemplate = (row: TaskApplication) => (
        <div className="flex justify-center">
            <button
                onClick={() => navigate(`/dashboard/volunteer/applied-task/${row.task.id}`)}
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
                <span className="relative z-10 flex items-center gap-3">
                    <i className="pi pi-eye text-xl"></i>
                    View Task
                </span>
                <div className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-2xl"></div>
            </button>
        </div>
    );

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };



    return (
        <div className="min-h-screen space-y-12 py-8 px-6">
            {/* Page Header */}
            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-teal-800 mb-4">
                    My Tasks
                </h1>
                <p className="text-2xl text-gray-700 font-medium">
                    Track all the opportunities you're part of
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <DataTable
                            value={tasks}
                            emptyMessage={
                                <div className="text-center py-20">
                                    <p className="text-2xl font-bold text-gray-500">No tasks yet</p>
                                    <p className="text-gray-400 mt-2">Your applied and completed tasks will appear here</p>
                                </div>
                            }
                            className="rounded-2xl overflow-hidden"
                            stripedRows
                            rowHover
                            tableStyle={{ minWidth: "50rem" }}

                        >
                            {/* TASK TITLE */}
                            <Column
                                field="task.title"
                                header="Task Title"
                                headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-6 text-lg border-r-2 border-gray-300"
                                headerStyle={{ textAlign: "center" }}
                                bodyClassName="px-6 py-6 text-left font-medium text-gray-800 border-r border-gray-200"
                                body={(row) => <span className="font-semibold">{row.task.title}</span>}
                                style={{ minWidth: "320px" }}
                            />

                            {/* LOCATION */}
                            <Column
                                field="task.location"
                                header="Location"
                                headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold text-center py-6 text-lg border-r-2 border-gray-300"
                                bodyClassName="px-6 py-6 text-center text-gray-700 border-r border-gray-200"
                                body={(row) => row.task.location || "Remote"}
                            />

                            {/* DEADLINE */}
                            <Column
                                field="task.end_date"
                                header="Deadline"
                                headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-6 text-lg border-r-2 border-gray-300"
                                headerStyle={{ textAlign: "center" }}
                                bodyClassName="px-6 py-6 text-center font-semibold text-gray-800 border-r border-gray-200"
                                body={(row) => formatDate(row.task.end_date)}
                            />

                            {/* STATUS */}
                            <Column
                                field="status"
                                header="Status"
                                headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold text-center py-6 text-lg border-r-2 border-gray-300 last:border-r-0"
                                bodyClassName="px-6 py-6 border-r border-gray-200 last:border-r-0"
                                body={statusTemplate}
                                style={{ minWidth: "180px" }}
                            />

                            {/* ACTION */}
                            <Column
                                header="Action"
                                headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold text-center py-6 text-lg"
                                bodyClassName="px-6 py-6 text-center"
                                body={actionTemplate}
                                style={{ minWidth: "200px" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-32 left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-10"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-10"></div>
            </div>
        </div>
    );
};

export default VolunteerTasks;