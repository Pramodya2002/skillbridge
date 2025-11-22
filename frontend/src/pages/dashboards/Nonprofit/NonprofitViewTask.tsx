import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";



interface Volunteer {
    id: number;
    user?: {
        name: string;
        email: string;
        phone?: string;
    };
    skills?: { skill: string; level: string }[];
    availability?: string;
    experience?: string;
}

interface Application {
    id: number;
    status: "applied" | "accepted" | "rejected";
    volunteer: Volunteer;
}

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
}

const NonprofitViewTask: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8000/api/tasks/${id}`)
            .then(res => res.json())
            .then(data => setTask(data))
            .catch(err => console.error("Error fetching task:", err));

        fetch(`http://localhost:8000/api/tasks/${id}/applications`)
            .then(res => res.json())
            .then(data => setApplications(data))
            .catch(err => console.error("Error fetching applications:", err));
    }, [id]);

    const updateApplicationStatus = async (appId: number, status: string) => {
        await fetch(`http://localhost:8000/api/task-applications/${appId}/update-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        fetch(`http://localhost:8000/api/tasks/${id}/applications`)
            .then(res => res.json())
            .then(data => setApplications(data));
    };

    if (!task) return <div className="p-6 text-center text-gray-600">Loading task details...</div>;



    return (
        <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg space-y-6 animate-fadeIn">
            {/* Task Details */}
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-4xl font-extrabold text-teal-700">{task.title}</h2>

            </div>

            <div className="space-y-4 text-lg text-gray-700">
                <p><strong>📌 Description:</strong> {task.description}</p>
                <p><strong>📍 Location:</strong> {task.location}</p>
                <p><strong>📅 Start Date:</strong> {task.start_date.slice(0, 10)}</p>
                <p><strong>⏳ End Date:</strong> {task.end_date.slice(0, 10)}</p>
                {task.cause && <p><strong>🎯 Cause:</strong> {task.cause}</p>}

                <p>
                    <strong>🛠 Required Skills:</strong>{" "}
                    {Array.isArray(task.required_skills) && task.required_skills.length > 0
                        ? task.required_skills.map((s) => `${s.skill} (${s.level})`).join(", ")
                        : "None"}
                </p>
                <p><strong>🙋 Volunteers Needed:</strong> {task.volunteers_needed}</p>
            </div>

            {/* Volunteer Applications */}
            <div className="pt-6 border-t">
                <h3 className="text-2xl font-bold text-teal-700 mb-4">Volunteer Applications</h3>

                {applications.length === 0 ? (
                    <p className="text-gray-500">No volunteers have applied yet.</p>
                ) : (
                    applications.map(app => (
                        <div
                            key={app.id}
                            className="p-4 bg-gray-50 rounded-lg shadow mb-3 border hover:shadow-lg transition"
                        >
                            {/* Volunteer Info */}
                            <p className="font-semibold text-lg text-teal-700">
                                {app.volunteer?.user?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-600">📧 Email: {app.volunteer?.user?.email || "N/A"}</p>
                            {app.volunteer?.user?.phone && (
                                <p className="text-sm text-gray-600">📞 Phone: {app.volunteer.user.phone}</p>
                            )}
                            {app.volunteer?.experience && (
                                <p className="text-sm text-gray-600">💼 Experience: {app.volunteer.experience}</p>
                            )}
                            {app.volunteer?.availability && (
                                <p className="text-sm text-gray-600">
                                    🕒 Availability:{" "}
                                    {typeof app.volunteer.availability === "string"
                                        ? app.volunteer.availability
                                        : Object.entries(app.volunteer.availability)
                                            .filter(([_, v]) => v)
                                            .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
                                            .join(", ")}
                                </p>
                            )}


                            <p className="text-sm text-gray-600">
                                🛠 Skills:{" "}
                                {Array.isArray(app.volunteer?.skills) && app.volunteer.skills.length > 0
                                    ? app.volunteer.skills.map(s => `${s.skill} (${s.level})`).join(", ")
                                    : "N/A"}
                            </p>

                            <Tag
                                value={app.status.toUpperCase()}
                                severity={
                                    app.status === "applied"
                                        ? "info"
                                        : app.status === "accepted"
                                            ? "success"
                                            : "danger"
                                }
                                className={`mt-2 px-3 py-1 font-bold rounded-full ${app.status === "applied"
                                    ? "bg-blue-500 text-white"
                                    : app.status === "accepted"
                                        ? "bg-green-500 text-white"
                                        : ""
                                    }`}
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-3">
                                {app.status !== "accepted" && (
                                    <Button
                                        label="Accept"
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                        onClick={() => updateApplicationStatus(app.id, "accepted")}
                                    />
                                )}
                                <Button
                                    label="Reject"
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                    onClick={() => updateApplicationStatus(app.id, "rejected")}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Back Button */}
            <div className="pt-4 border-t">
                <Button label="← Back to Tasks" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg shadow-md" onClick={() => navigate("/dashboard/nonprofit/tasks")} />
            </div>
        </div>
    );
};

export default NonprofitViewTask;
