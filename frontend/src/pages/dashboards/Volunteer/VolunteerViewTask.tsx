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
    status: string;
}

const VolunteerViewTask: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetch(`http://localhost:8000/api/tasks/${id}`)
            .then(res => res.json())
            .then(data => setTask(data))
            .catch(err => console.error("Error fetching task:", err));
    }, [id]);

    const handleApply = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${id}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id }),
            });

            if (!response.ok) throw new Error("Failed to apply");

            alert("You have successfully applied for this task!");
            navigate("/dashboard/volunteer");
        } catch (error) {
            console.error("Error applying for task:", error);
        }
    };

    if (!task) return <div className="p-6 text-center">Loading task details...</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg space-y-6">
            <h2 className="text-3xl font-bold text-teal-700">{task.title}</h2>
            <Tag value={task.status} severity={task.status === "Open" ? "success" : task.status === "Ongoing" ? "info" : "danger"} />
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Location:</strong> {task.location}</p>
            <p><strong>Start Date:</strong> {task.start_date}</p>
            <p><strong>End Date:</strong> {task.end_date}</p>
            <p><strong>Required Skills:</strong> {task.required_skills.join(", ")}</p>
            <p><strong>Volunteers Needed:</strong> {task.volunteers_needed}</p>

            <div className="flex gap-4 mt-4">
                <Button
                    label="Confirm Apply"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition duration-200"
                    onClick={handleApply}
                />
                <Button
                    label="Back"
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg shadow transition duration-200"
                    onClick={() => navigate("/dashboard/volunteer")}
                />
            </div>
        </div>
    );
};

export default VolunteerViewTask;
