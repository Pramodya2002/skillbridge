import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";


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

const VolunteerViewTask: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const location = useLocation();
    const toast = useRef<Toast>(null);
    const reasons = (location.state as any)?.reasons || [];
    const formatDate = (dateStr: string) => dateStr?.slice(0, 10);

    useEffect(() => {
        fetch(`http://localhost:8000/api/tasks/${id}`)
            .then(res => res.json())
            .then(data => {
                const parsedTask: Task = {
                    ...data,
                    required_skills: Array.isArray(data.required_skills)
                        ? data.required_skills
                        : JSON.parse(data.required_skills || "[]"),
                    cause: data.cause || null,
                };
                setTask(parsedTask);
            })
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

            toast.current?.show({
                severity: "success",
                summary: "Application Successful",
                detail: `You have successfully applied for "${task?.title}".`,
                life: 3000,
                style: {
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                },
                icon: 'pi pi-check-circle'
            });

            setShowConfirm(false);

            setTimeout(() => navigate("/dashboard/volunteer"), 1500);
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: String(error),
                life: 3000,
            });
        }
    };

    if (!task) return <div className="p-6 text-center text-lg font-semibold">Loading task details...</div>;

    return (
        <div className="flex items-center justify-center">
            <Toast ref={toast} />
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 space-y-6">
                {/* Header */}
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

                {/* Task Details */}
                <div className="text-lg space-y-4 mt-4">
                    <p><strong className="text-teal-700">Description:</strong> {task.description}</p>
                    <p><strong className="text-teal-700">Location:</strong> {task.location}</p>
                    <div>
                        <strong className="text-teal-700">Task Period:</strong>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow">
                                Start: {formatDate(task.start_date)}
                            </span>
                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow">
                                End: {formatDate(task.end_date)}
                            </span>
                        </div>
                    </div>
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

                {/* Matching Reasons */}
                {reasons.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <h4 className="font-bold text-teal-700">Matched because:</h4>
                        <ul className="list-disc ml-6 text-gray-700">
                            {reasons.map((r: string, i: number) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button
                        label="Apply"
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition duration-200 text-lg w-full sm:w-auto"
                        onClick={() => setShowConfirm(true)}
                    />
                    <Button
                        label="Back"
                        className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-lg shadow transition duration-200 text-lg w-full sm:w-auto"
                        onClick={() => navigate("/dashboard/volunteer")}
                    />
                </div>

                {/* Confirm Apply Dialog */}
                <Dialog
                    header={<h3 className="text-2xl font-bold text-teal-700">Confirm Application</h3>}
                    visible={showConfirm}
                    onHide={() => setShowConfirm(false)}
                    className="w-[500px]"
                    style={{
                        backgroundColor: "#abf8daff",
                        borderRadius: "16px",
                        padding: "20px"
                    }}
                >
                    <div className="p-4 text-gray-700 space-y-4">
                        <p className="text-lg">
                            You are about to apply for <strong className="text-teal-700">{task.title}</strong>.
                        </p>
                        <p className="text-sm text-gray-500">
                            Once you apply, the nonprofit will review your application and get back to you.
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                label="Cancel"
                                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg shadow"
                                onClick={() => setShowConfirm(false)}
                            />
                            <Button
                                label="Confirm Apply"
                                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg shadow"
                                onClick={handleApply}
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default VolunteerViewTask;
