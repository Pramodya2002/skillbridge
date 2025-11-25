import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

type OptionType = { value: string; label: string };
type SkillWithLevel = {
    skill: string;
    level: string;
};


const skillOptions: OptionType[] = [
    { value: "graphic-design", label: "Graphic Design" },
    { value: "web-development", label: "Web Development" },
    { value: "content-writing", label: "Content Writing" },
    { value: "data-analysis", label: "Data Analysis" },
    { value: "marketing", label: "Marketing" },
];

const causeOptions: OptionType[] = [
    { value: "education", label: "Education" },
    { value: "health", label: "Health" },
    { value: "environment", label: "Environment" },
    { value: "animal-welfare", label: "Animal Welfare" },
    { value: "youth", label: "Youth Empowerment" },
    { value: "human-rights", label: "Human Rights" },
    { value: "arts", label: "Arts & Culture" },
    { value: "disaster-relief", label: "Disaster Relief" },
    { value: "technology", label: "Technology for Good" },
    { value: "sports", label: "Sports & Recreation" },
];

const levelOptions: OptionType[] = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" },
];

const NonprofitCreateTask: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [requiredSkills, setRequiredSkills] = useState<SkillWithLevel[]>([]);
    const [selectedSkill, setSelectedSkill] = useState<OptionType | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<OptionType | null>(null);
    const [cause, setCause] = useState<string | null>(null);
    const [volunteersNeeded, setVolunteersNeeded] = useState<number | null>(null);
    const [status, setStatus] = useState("Open");

    const navigate = useNavigate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const statuses = [
        { label: "Open", value: "Open" },
        { label: "Ongoing", value: "Ongoing" },
        { label: "Completed", value: "Completed" },
    ];


    const addSkill = () => {
        if (selectedSkill && selectedLevel) {
            setRequiredSkills([
                ...requiredSkills,
                { skill: selectedSkill.value, level: selectedLevel.value },
            ]);
            setSelectedSkill(null);
            setSelectedLevel(null);
        }
    };

    const removeSkill = (index: number) => {
        setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title || !description || !location || !startDate || !endDate || !volunteersNeeded) {
            alert("Please fill all required fields");
            return;
        }
        if (endDate! < startDate!) {
            alert("End date cannot be earlier than start date");
            return;
        }

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const newTask = {
            title,
            description,
            location,
            start_date: formatDate(startDate!),
            end_date: formatDate(endDate!),
            required_skills: requiredSkills,
            cause,
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

                    {/* ========== START DATE ========== */}
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold text-gray-700">Start Date</label>
                        <Calendar
                            value={startDate}
                            onChange={(e) => setStartDate(e.value as Date | null)}
                            minDate={today}
                            showIcon
                            iconPos="left"
                            dateFormat="dd/mm/yy"
                            placeholder="Select start date"
                            className="w-full"
                            inputClassName="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            panelClassName="bg-white border border-gray-300 shadow-2xl mt-1 rounded-lg overflow-hidden"
                            showButtonBar
                            todayButtonClassName="p-button-text text-teal-600 hover:bg-teal-50"
                            clearButtonClassName="p-button-text text-gray-600 hover:bg-gray-100"

                            // This works in ALL PrimeReact versions
                            dateTemplate={(date) => {
                                const isToday = date.day === new Date().getDate() &&
                                    date.month === new Date().getMonth() &&
                                    date.year === new Date().getFullYear();

                                const isSelected = startDate &&
                                    date.day === startDate.getDate() &&
                                    date.month === startDate.getMonth() &&
                                    date.year === startDate.getFullYear();

                                const isOtherMonth = date.month !== new Date().getMonth();

                                let className = "p-2 text-center cursor-pointer";

                                if (isOtherMonth) {
                                    className += " text-gray-400 opacity-60";
                                } else if (isToday) {
                                    className += " bg-teal-100 text-teal-800 font-bold rounded-full";
                                } else if (isSelected) {
                                    className += " bg-teal-600 text-white font-bold rounded-full";
                                }

                                return <span className={className}>{date.day}</span>;
                            }}
                        />
                    </div>

                    {/* ========== END DATE ========== */}
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold text-gray-700">End Date</label>
                        <Calendar
                            value={endDate}
                            onChange={(e) => setEndDate(e.value as Date | null)}
                            minDate={startDate || today}
                            showIcon
                            iconPos="left"
                            dateFormat="dd/mm/yy"
                            placeholder="Select end date"
                            className="w-full"
                            inputClassName="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            panelClassName="bg-white border border-gray-300 shadow-2xl mt-1 rounded-lg overflow-hidden"
                            showButtonBar
                            todayButtonClassName="p-button-text text-teal-600 hover:bg-teal-50"
                            clearButtonClassName="p-button-text text-gray-600 hover:bg-gray-100"

                            dateTemplate={(date) => {
                                const isToday = date.day === new Date().getDate() &&
                                    date.month === new Date().getMonth() &&
                                    date.year === new Date().getFullYear();

                                const isSelected = endDate &&
                                    date.day === endDate.getDate() &&
                                    date.month === endDate.getMonth() &&
                                    date.year === endDate.getFullYear();

                                const isOtherMonth = date.month !== new Date().getMonth();

                                let className = "p-2 text-center cursor-pointer";

                                if (isOtherMonth) {
                                    className += " text-gray-400 opacity-60";
                                } else if (isToday) {
                                    className += " bg-teal-100 text-teal-800 font-bold rounded-full";
                                } else if (isSelected) {
                                    className += " bg-teal-600 text-white font-bold rounded-full";
                                }

                                return <span className={className}>{date.day}</span>;
                            }}
                        />
                        {startDate && endDate && endDate < startDate && (
                            <small className="text-red-500 mt-2 font-medium">
                                End date cannot be earlier than start date
                            </small>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Cause</label>
                        <Dropdown
                            value={cause}
                            options={causeOptions}
                            onChange={(e) => setCause(e.value)}
                            placeholder="Select Cause"
                            className="w-full border border-gray-300 rounded-md focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200"
                            panelClassName="bg-white border border-gray-300 rounded-md shadow-lg mt-1"
                        />
                    </div>


                    <div className="flex flex-col space-y-2">
                        <label className="mb-1 font-semibold">Required Skills & Levels</label>
                        <div className="flex space-x-2">
                            <Select options={skillOptions} value={selectedSkill} onChange={(val) => setSelectedSkill(val as OptionType)} placeholder="Select skill" />
                            <Select options={levelOptions} value={selectedLevel} onChange={(val) => setSelectedLevel(val as OptionType)} placeholder="Select level" />
                            <Button label="Add" onClick={addSkill} className="bg-teal-600 text-white px-3" />
                        </div>
                        <ul className="mt-2">
                            {requiredSkills.map((s, i) => (
                                <li key={i} className="flex justify-between items-center border p-2 rounded">
                                    {s.skill} ({s.level})
                                    <Button label="X" onClick={() => removeSkill(i)} className="bg-red-500 text-white px-2 py-1 rounded" />
                                </li>
                            ))}
                        </ul>
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
