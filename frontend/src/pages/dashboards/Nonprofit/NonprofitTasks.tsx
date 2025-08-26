import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

interface Task {
    id: number;
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    required_skills: string;
    volunteers_needed: number;
    status: "Open" | "Ongoing" | "Completed";
}

const NonprofitTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/api/tasks")
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching tasks:", err));
    }, []);

    const actionBodyTemplate = (row: Task) => (
        <button
            className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded flex items-center gap-1 transition duration-200"
            onClick={() => alert(`Viewing task: ${row.title}`)}
        >
            <i className="pi pi-eye"></i> View
        </button>
    );

    return (
        <div className="space-y-8">
            {/* Header and Create Task Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-teal-700">Tasks List</h2>
                    <p className="text-gray-600 mt-1">View all tasks and manage them.</p>
                </div>
                <Button
                    label="Create New Task"
                    icon="pi pi-plus"
                    className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded shadow transition duration-200"
                    onClick={() => navigate("/dashboard/nonprofit/create-task")}
                />
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
                <DataTable
                    value={tasks}
                    stripedRows
                    scrollable
                    tableStyle={{ minWidth: '800px' }}
                    className="shadow-sm rounded-lg"
                >
                    <Column field="title" header="Title" />
                    <Column field="description" header="Description" />
                    <Column field="location" header="Location" />
                    <Column field="start_date" header="Start Date" />
                    <Column field="end_date" header="End Date" />
                    <Column field="required_skills" header="Required Skills" />
                    <Column field="volunteers_needed" header="Volunteers Needed" />
                    <Column field="status" header="Status" />
                    <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>
            </div>
        </div>
    );
};

export default NonprofitTasks;
