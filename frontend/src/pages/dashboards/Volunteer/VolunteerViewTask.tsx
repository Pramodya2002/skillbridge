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
    const formatDate = (dateStr: string) => dateStr?.slice(0, 10);

    useEffect(() => {
        fetch(`http://localhost:8000/api/tasks/${id}`)
            .then(res => res.json())
            .then(data => setTask(data))
            .catch(err => console.error("Error fetching task:", err));
    }, [id]);

    const handleApply = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/task-applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    volunteer_id: user.volunteer_id || user.id,
                    task_id: task?.id
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to apply");
            }

            alert("You have successfully applied for this task!");
            navigate("/dashboard/volunteer");
        } catch (error) {
            console.error("Error applying for task:", error);
            alert("Error: " + error);
        }
    };

    if (!task) return <div className="p-6 text-center text-lg font-semibold">Loading task details...</div>;

    return (
        <div className=" flex items-center justify-center ">
            {/* Single Task Card */}
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-teal-700">{task.title}</h2>
                    <Tag
                        value={task.status}
                        severity={
                            task.status === "Open"
                                ? "success"
                                : task.status === "Ongoing"
                                    ? "info"
                                    : "danger"
                        }
                        className="text-lg font-bold px-5 py-2 rounded-full shadow-md"
                    />
                </div>


                <div className="text-lg space-y-4 mt-4">
                    <p><strong className="text-teal-700">Description:</strong> {task.description}</p>
                    <p><strong className="text-teal-700">Location:</strong> {task.location}</p>
                    <p><strong className="text-teal-700">Task Period:</strong> {formatDate(task.start_date)} → {formatDate(task.end_date)}</p>
                    <p><strong className="text-teal-700">Required Skills:</strong> {task.required_skills.join(", ")}</p>
                    <p><strong className="text-teal-700">Volunteers Needed:</strong> {task.volunteers_needed}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button
                        label="Confirm Apply"
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition duration-200 text-lg w-full sm:w-auto"
                        onClick={handleApply}
                    />
                    <Button
                        label="Back"
                        className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-lg shadow transition duration-200 text-lg w-full sm:w-auto"
                        onClick={() => navigate("/dashboard/volunteer")}
                    />
                </div>
            </div>
        </div>
    );
};

export default VolunteerViewTask;
