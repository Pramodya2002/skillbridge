import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const NonprofitCreateTask: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!title || !description) return;

        const newTask = { title, description };

        try {
            const response = await fetch("http://localhost:8000/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) throw new Error("Failed to create task");

            // Redirect back to task list after creation
            navigate("/dashboard/nonprofit/tasks");
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">
                    Create New Task
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    Enter the task details below
                </p>

                <div className="flex flex-col gap-4">
                    <label className="font-semibold text-gray-700">Task Title</label>
                    <InputText
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:border-teal-500 focus:ring focus:ring-teal-200"
                    />

                    <label className="font-semibold text-gray-700">Task Description</label>
                    <InputText
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:border-teal-500 focus:ring focus:ring-teal-200"
                    />

                    <div className="flex justify-between mt-6">
                        <Button
                            label="Create Task"
                            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded shadow"
                            onClick={handleSubmit}
                        />
                        <Button
                            label="Cancel"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded shadow"
                            onClick={() => navigate("/dashboard/nonprofit/tasks")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NonprofitCreateTask;
