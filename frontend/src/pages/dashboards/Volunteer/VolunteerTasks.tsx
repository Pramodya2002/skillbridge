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
        const statusColors: Record<string, string> = {
            completed: "bg-green-500 text-white",
            applied: "bg-blue-500 text-white",
            pending: "bg-yellow-500 text-white",
        };

        return (
            <Tag
                value={row.status}
                className={`px-4 py-2 text-sm font-bold rounded-full shadow-md ${statusColors[row.status] || "bg-gray-400 text-white"
                    }`}
            />
        );
    };

    const actionTemplate = (row: TaskApplication) => (
        <button
            className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded flex items-center gap-1 transition duration-200"
            onClick={() => navigate(`/dashboard/volunteer/applied-task/${row.task.id}`)}
        >
            <i className="pi pi-eye"></i> View
        </button>
    );

    const formatDate = (dateStr: string) => dateStr?.slice(0, 10);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-teal-700">My Tasks</h2>
                    <p className="text-gray-600 mt-1">
                        View all tasks you have applied for or completed.
                    </p>
                </div>
            </div>
            {/* Tasks Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
                <DataTable
                    value={tasks}
                    stripedRows
                    scrollable
                    tableStyle={{ minWidth: "800px" }}
                    className="shadow-sm rounded-lg text-lg"
                >
                    <Column
                        field="task.title"
                        header="Task"
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-lg"
                    />
                    <Column
                        field="task.location"
                        header="Location"
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-lg"
                    />
                    <Column
                        field="task.end_date"
                        header="Deadline"
                        body={(row) => formatDate(row.task.end_date)}
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-lg"
                    />
                    <Column
                        field="status"
                        header="Status"
                        body={statusTemplate}
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-lg"
                    />
                    <Column
                        header="Action"
                        body={actionTemplate}
                        headerClassName="bg-gray-100 text-gray-800 font-bold text-lg"
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default VolunteerTasks;
