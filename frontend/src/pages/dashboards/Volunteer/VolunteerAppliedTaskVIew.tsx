import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

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
    required_skills?: Skill[];
    cause?: string | null;
    volunteers_needed: number;
    status: string;
    created_at?: string;
    updated_at?: string;
}

const VolunteerAppliedTaskView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const navigate = useNavigate();
    const formatDate = (dateStr: string) => dateStr?.slice(0, 10);

    useEffect(() => {
        fetch(`http://localhost:8000/api/tasks/${id}`)
            .then((res) => res.json())
            .then((data) => {
                const parsedTask: Task = {
                    ...data,
                    required_skills: Array.isArray(data.required_skills)
                        ? data.required_skills
                        : JSON.parse(data.required_skills || "[]"),
                };
                setTask(parsedTask);
            })
            .catch((err) => console.error("Error fetching task details:", err));
    }, [id]);

    if (!task) return <div className="p-6 text-center text-lg font-semibold">Loading task details...</div>;

    return (
        <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 space-y-6">
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

                <div className="text-lg space-y-4">
                    <p><strong className="text-teal-700">Description:</strong> {task.description}</p>
                    <p><strong className="text-teal-700">Location:</strong> {task.location}</p>
                    <p>
                        <strong className="text-teal-700">Task Period:</strong>{" "}
                        {formatDate(task.start_date)} → {formatDate(task.end_date)}
                    </p>
                    <p>
                        <strong className="text-teal-700">Required Skills:</strong>{" "}
                        {task.required_skills?.map((s, i) => (
                            <Tag key={i} value={`${s.skill} (${s.level})`} className="mr-2 bg-purple-100 text-purple-700" />
                        ))}
                    </p>
                    {task.cause && <p><strong className="text-teal-700">Cause:</strong> {task.cause}</p>}
                    <p><strong className="text-teal-700">Volunteers Needed:</strong> {task.volunteers_needed}</p>
                    {task.created_at && <p><strong className="text-teal-700">Posted On:</strong> {formatDate(task.created_at)}</p>}
                </div>

                <div className="flex justify-end mt-6">
                    <Button
                        label="Back to My Tasks"
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow"
                        onClick={() => navigate("/dashboard/volunteer/tasks")}
                    />
                </div>
            </div>
        </div>
    );
};

export default VolunteerAppliedTaskView;
