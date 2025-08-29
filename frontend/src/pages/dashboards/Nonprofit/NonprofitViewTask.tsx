import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

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

    if (!task) return <div className="p-6">Loading task details...</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg space-y-4">
            <h2 className="text-3xl font-bold text-teal-700">{task.title}</h2>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Location:</strong> {task.location}</p>
            <p><strong>Start Date:</strong> {task.start_date}</p>
            <p><strong>End Date:</strong> {task.end_date}</p>
            <p><strong>Required Skills:</strong> {task.required_skills.join(", ")}</p>
            <p><strong>Volunteers Needed:</strong> {task.volunteers_needed}</p>
            <p><strong>Status:</strong> {task.status}</p>

            <Button
                label="Back to Tasks"
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
                onClick={() => navigate("/dashboard/nonprofit/tasks")}
            />
        </div>
    );
};

export default NonprofitViewTask;
