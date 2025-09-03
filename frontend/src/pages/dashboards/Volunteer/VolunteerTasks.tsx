import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

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

    useEffect(() => {
        if (!volunteerId) return;

        fetch(`http://localhost:8000/api/volunteers/${volunteerId}/tasks`)
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error("Error fetching volunteer tasks:", err));
    }, [volunteerId]);

    const statusTemplate = (row: TaskApplication) => {
        const severity =
            row.status === "completed"
                ? "success"
                : row.status === "applied"
                    ? "info"
                    : "warning";
        return <Tag value={row.status} severity={severity as any} />;
    };

    const actionTemplate = (row: TaskApplication) => (
        <Button
            label="View"
            severity="secondary"
            className="p-button-sm"
            onClick={() => alert(`Viewing task: ${row.task.title}`)}
        />
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
            <DataTable
                value={tasks}
                responsiveLayout="scroll"
                className="shadow-md border border-gray-200"
                rowHover
            >
                <Column field="task.title" header="Task" headerClassName="bg-gray-100 font-semibold" className="p-2" />
                <Column field="task.location" header="Location" headerClassName="bg-gray-100 font-semibold" className="p-2" />
                <Column field="task.end_date" header="Deadline" headerClassName="bg-gray-100 font-semibold" className="p-2" />
                <Column field="status" header="Status" body={statusTemplate} headerClassName="bg-gray-100 font-semibold" className="p-2" />
                <Column header="Action" body={actionTemplate} headerClassName="bg-gray-100 font-semibold" className="p-2" />
            </DataTable>
        </div>
    );
};

export default VolunteerTasks;
