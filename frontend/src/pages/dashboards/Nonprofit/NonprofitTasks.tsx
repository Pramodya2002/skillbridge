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
        fetch("http://localhost:8000/api/tasks")
            .then((res) => res.json())
            .then((data) => setTasks(data.data ?? data))
            .catch((err) => console.error("Error fetching tasks:", err));
    };


    useEffect(() => {
        fetchTasks();
    }, []);


    const formatDate = (dateStr: string) => dateStr.slice(0, 10);

    const actionBodyTemplate = (row: Task) => (
        <button
            className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded flex items-center gap-1 transition duration-200"
            onClick={() => navigate(`/dashboard/nonprofit/tasks/${row.id}`)}
        >
            <i className="pi pi-eye"></i> View
        </button>
    );

    const statusBodyTemplate = (row: Task) => {
        const statusColors: Record<Task["status"], string> = {
            Open: "bg-green-500 text-white",
            Ongoing: "bg-blue-500 text-white",
            Completed: "bg-red-500 text-white",
        };

        return (
            <Tag
                value={row.status}
                className={`px-4 py-2 text-sm font-bold rounded-full shadow-md ${statusColors[row.status]}`}
            />
        );
    };

    return (
        <div className="space-y-8">
            {/* Header and Create Task Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-teal-700">Tasks List</h2>
                    <p className="text-gray-600 mt-1">View all tasks and manage them.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        label="Refresh"
                        icon="pi pi-refresh"
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded shadow transition duration-200"
                        onClick={fetchTasks}
                    />
                    <Button
                        label="Create New Task"
                        icon="pi pi-plus"
                        className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded shadow transition duration-200"
                        onClick={() => navigate("/dashboard/nonprofit/create-task")}
                    />
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
                <DataTable
                    value={tasks}
                    stripedRows
                    scrollable
                    showGridlines
                    tableStyle={{ minWidth: "1000px", borderCollapse: "collapse" }}
                    className="shadow-sm rounded-lg text-base border border-gray-300"
                >
                    <Column field="title" header="Title" headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2" />

                    <Column field="description" header="Description" headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2" />

                    <Column field="location" header="Location" headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2" />

                    <Column
                        field="start_date"
                        header="Start Date"
                        body={(row) => formatDate(row.start_date)}
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2"
                    />

                    <Column
                        field="end_date"
                        header="End Date"
                        body={(row) => formatDate(row.end_date)}
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2"
                    />

                    <Column field="cause" header="Cause" headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2" />

                    <Column
                        field="required_skills"
                        header="Required Skills"
                        body={(row) =>
                            Array.isArray(row.required_skills)
                                ? row.required_skills.map((s: any) => `${s.skill} (${s.level})`).join(", ")
                                : row.required_skills
                        }
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2"
                    />

                    <Column field="volunteers_needed" header="Volunteers Needed" headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2 text-center" />

                    <Column
                        field="status"
                        header="Status"
                        body={statusBodyTemplate}
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2 text-center"
                    />

                    <Column
                        field="applications_count"
                        header="Applied Volunteers"
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2 text-center"
                    />

                    <Column header="Actions" body={actionBodyTemplate} headerClassName="bg-gray-100 text-gray-800 font-bold text-base border border-gray-300"
                        bodyClassName="border border-gray-200 px-3 py-2 text-center" />
                </DataTable>
            </div>
        </div>
    );
};

export default NonprofitTasks;
