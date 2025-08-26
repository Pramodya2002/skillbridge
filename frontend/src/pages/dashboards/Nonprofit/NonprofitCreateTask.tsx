import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";

const NonprofitCreateTask: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [skills, setSkills] = useState("");
    const [volunteersNeeded, setVolunteersNeeded] = useState<number | null>(null);
    const [status, setStatus] = useState("Open");

    const navigate = useNavigate();

    const statuses = [
        { label: "Open", value: "Open" },
        { label: "Ongoing", value: "Ongoing" },
        { label: "Completed", value: "Completed" },
    ];

    const handleSubmit = async () => {
        if (!title || !description || !location || !startDate || !endDate || !volunteersNeeded) return;

        const newTask = {
            title,
            description,
            location,
            start_date: startDate ? startDate.toISOString().split('T')[0] : null,
            end_date: endDate ? endDate.toISOString().split('T')[0] : null,
            required_skills: skills,
            volunteers_needed: volunteersNeeded,
            status,
        };

        try {
            const response = await fetch("http://localhost:8000/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) throw new Error("Failed to create task");

            navigate("/dashboard/nonprofit/tasks");
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-3xl font-bold text-teal-700 text-center">Create New Task</h2>

                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Task Title</label>
                        <InputText
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring focus:ring-teal-200"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Task Description</label>
                        <InputText
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring focus:ring-teal-200"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Location</label>
                        <InputText
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring focus:ring-teal-200"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Start Date</label>
                        <Calendar
                            value={startDate}
                            onChange={(e) => setStartDate(e.value as Date)}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:border-teal-500 focus:ring focus:ring-teal-200"
                            panelClassName="bg-white border border-gray-300 shadow-lg rounded"
                            showIcon
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">End Date</label>
                        <Calendar
                            value={endDate}
                            onChange={(e) => setEndDate(e.value as Date)}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:border-teal-500 focus:ring focus:ring-teal-200"
                            panelClassName="bg-white border border-gray-300 shadow-lg rounded"
                            showIcon
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Required Skills</label>
                        <InputText
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring focus:ring-teal-200"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Volunteers Needed</label>
                        <InputText
                            type="number"
                            value={volunteersNeeded !== undefined && volunteersNeeded !== null ? volunteersNeeded.toString() : ""}
                            onChange={(e) => setVolunteersNeeded(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring focus:ring-teal-200"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Status</label>
                        <Dropdown
                            value={status}
                            options={statuses}
                            onChange={(e) => setStatus(e.value)}
                            panelClassName="bg-white"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:border-teal-500 focus:ring focus:ring-teal-200"
                        />
                    </div>


                    <div className="flex justify-between mt-6">
                        <Button
                            label="Create Task"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded shadow-lg transition duration-200"
                            onClick={handleSubmit}
                        />
                        <Button
                            label="Cancel"
                            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded shadow-lg transition duration-200"
                            onClick={() => navigate("/dashboard/nonprofit/tasks")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NonprofitCreateTask;
