import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

interface Task {
    id: number;
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    required_skills: string[];
    volunteers_needed: number;
    status: "Open" | "Ongoing" | "Completed";
}

const NonprofitViewTask: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8000/api/tasks/${id}`)
            .then(res => res.json())
            .then(data => setTask(data))
            .catch(err => console.error("Error fetching task:", err));
    }, [id]);

    if (!task) return <div className="p-6 text-center text-gray-600">Loading task details...</div>;

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case "Open":
                return "success";
            case "Ongoing":
                return "info";
            case "Completed":
                return "danger";
            default:
                return "secondary";
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-4xl font-extrabold text-teal-700">{task.title}</h2>
                <Tag
                    value={task.status}
                    severity={getStatusSeverity(task.status)}
                    className="text-lg font-semibold px-4 py-2 rounded-full shadow"
                />
            </div>

            {/* Details Section */}
            <div className="space-y-4 text-lg text-gray-700">
                <p><span className="font-semibold text-gray-900">📌 Description:</span> {task.description}</p>
                <p><span className="font-semibold text-gray-900">📍 Location:</span> {task.location}</p>
                <p><span className="font-semibold text-gray-900">📅 Start Date:</span> {task.start_date.slice(0, 10)}</p>
                <p><span className="font-semibold text-gray-900">⏳ End Date:</span> {task.end_date.slice(0, 10)}</p>
                <p><span className="font-semibold text-gray-900">🛠 Required Skills:</span> {task.required_skills.join(", ")}</p>
                <p><span className="font-semibold text-gray-900">🙋 Volunteers Needed:</span> {task.volunteers_needed}</p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t">
                <Button
                    label="← Back to Tasks"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200"
                    onClick={() => navigate("/dashboard/nonprofit/tasks")}
                />
            </div>
        </div>
    );
};

export default NonprofitViewTask;
