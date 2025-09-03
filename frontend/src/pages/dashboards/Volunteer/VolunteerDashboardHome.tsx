import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";

interface Task {
    id: number;
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    required_skills?: string[];
}

type Match = { task: Task; score: number };

const VolunteerMatches: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const volunteerId = user?.volunteer_id || user?.id;

    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const formatDate = (dateStr: string) => dateStr?.slice(0, 10);

    useEffect(() => {
        if (!volunteerId) return;

        Promise.all([
            fetch(`http://localhost:8000/api/volunteers/${volunteerId}/matched-tasks`).then(res => res.json()),
            fetch(`http://localhost:8000/api/volunteers/${volunteerId}/tasks`).then(res => res.json()),
            fetch(`http://localhost:8000/api/tasks`).then(res => res.json()),
        ])
            .then(([matches, applied]) => {
                const appliedTaskIds = applied.map((a: any) => a.task.id);
                setMatches(matches.filter((m: any) => !appliedTaskIds.includes(m.task.id)));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [volunteerId]);

    if (!volunteerId) return <div>Please login as a volunteer to see matches.</div>;

    return (
        <div className="p-6 mb-8 space-y-10">
            <h2 className="text-2xl font-extrabold text-teal-700 mb-4">🔹 Your Matched Tasks</h2>
            {loading ? (
                <p>Loading...</p>
            ) : matches.length === 0 ? (
                <p className="text-gray-500">No matched tasks found.</p>
            ) : (
                matches.map((m) => (
                    <Card key={m.task.id} className="p-6 mb-6 rounded-2xl shadow-2xl bg-white">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-extrabold text-2xl text-teal-700">{m.task.title}</h3>
                            <Tag
                                value={`Matched ${m.score}%`}
                                className="text-lg font-bold px-4 py-2 rounded-full shadow-md bg-gradient-to-r from-teal-400 to-green-500 text-white"
                            />
                        </div>
                        <p className="text-gray-700 text-lg mb-3">{m.task.description}</p>
                        <div className="flex flex-wrap gap-4 text-md font-semibold">
                            {m.task.location && (
                                <span className="bg-teal-100 px-3 py-1 rounded-lg text-teal-700">
                                    📍 {m.task.location}
                                </span>
                            )}
                            {m.task.start_date && m.task.end_date && (
                                <span className="bg-yellow-100 px-3 py-1 rounded-lg text-yellow-700">
                                    📅 {formatDate(m.task.start_date)} → {formatDate(m.task.end_date)}
                                </span>
                            )}
                            {m.task.required_skills?.length && (
                                <span className="bg-purple-100 px-3 py-1 rounded-lg text-purple-700">
                                    🛠 {m.task.required_skills.join(", ")}
                                </span>
                            )}
                        </div>
                        <Button
                            label="View"
                            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg shadow"
                            onClick={() => navigate(`/dashboard/volunteer/tasks/${m.task.id}`)}
                        />
                    </Card>
                ))
            )}
        </div>
    );
};

const VolunteerDashboardHome: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const volunteerId = user?.volunteer_id || user?.id;
    const navigate = useNavigate();

    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [appliedTaskIds, setAppliedTaskIds] = useState<number[]>([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchSkill, setSearchSkill] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (!volunteerId) return;

        // fetch all tasks
        fetch("http://localhost:8000/api/tasks")
            .then(res => res.json())
            .then(data => setAllTasks(data))
            .catch(console.error);

        // fetch applied tasks for this volunteer
        fetch(`http://localhost:8000/api/volunteers/${volunteerId}/applied-tasks`)
            .then(res => res.json())
            .then((applied: any[]) => {
                setAppliedTaskIds(applied.map(a => a.task_id));
            })
            .catch(console.error);
    }, [volunteerId]);


    const formatDate = (dateStr: string) => dateStr?.slice(0, 10);

    const titles = Array.from(new Set(allTasks.map(t => t.title))).map(title => ({ label: title, value: title }));
    const locations = Array.from(new Set(allTasks.map(t => t.location))).map(loc => ({ label: loc, value: loc }));
    const skills = Array.from(new Set(allTasks.flatMap(t => t.required_skills || []))).map(skill => ({ label: skill, value: skill }));

    const filteredTasks = allTasks.filter(task => !appliedTaskIds.includes(task.id))
        .filter((task) => {
            const matchTitle = searchTitle ? task.title === searchTitle : true;
            const matchLocation = searchLocation ? task.location === searchLocation : true;
            const matchSkill = searchSkill ? task.required_skills?.includes(searchSkill) : true;

            const matchStart = startDate ? new Date(task.start_date) >= startDate : true;
            const matchEnd = endDate ? new Date(task.end_date) <= endDate : true;

            return matchTitle && matchLocation && matchSkill && matchStart && matchEnd;
        });



    return (
        <div className="space-y-8 p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-teal-600">Welcome back, {user.name || "Volunteer"}!</h2>
                <p className="text-gray-600 text-lg mt-2">Ready to make a difference today?</p>
            </div>

            <VolunteerMatches />

            {/* Browse All Tasks with Filters */}
            <div>
                <h2 className="text-2xl font-extrabold text-teal-700 mb-4">📂 Browse All Tasks</h2>

                <div className="flex flex-wrap gap-4 mb-6">
                    <Dropdown
                        value={searchTitle}
                        options={titles}
                        onChange={(e) => setSearchTitle(e.value)}
                        placeholder="Select Title"
                        className="w-full md:w-1/4 border border-gray-300 rounded-lg bg-white p-2 shadow-sm"
                        panelClassName="bg-white shadow-lg"
                        showClear
                    />
                    <Dropdown
                        value={searchLocation}
                        options={locations}
                        onChange={(e) => setSearchLocation(e.value)}
                        placeholder="Select Location"
                        className="w-full md:w-1/4 border border-gray-300 rounded-lg bg-white p-2 shadow-sm"
                        panelClassName="bg-white shadow-lg"
                        showClear
                    />
                    <Dropdown
                        value={searchSkill}
                        options={skills}
                        onChange={(e) => setSearchSkill(e.value)}
                        placeholder="Select Skill"
                        className="w-full md:w-1/4 border border-gray-300 rounded-lg bg-white p-2 shadow-sm"
                        panelClassName="bg-white shadow-lg"
                        showClear
                    />
                    <Calendar
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.value as Date | null)}
                        showIcon
                        showButtonBar
                        className="w-full md:w-1/6 border border-gray-300 rounded-lg bg-white p-2 shadow-sm"
                        inputClassName="bg-white"
                        panelClassName="bg-white shadow-lg"
                    />
                    <Calendar
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.value as Date | null)}
                        showIcon
                        showButtonBar
                        className="w-full md:w-1/6 border border-gray-300 rounded-lg bg-white p-2 shadow-sm"
                        inputClassName="bg-white"
                        panelClassName="bg-white shadow-lg"
                    />
                </div>


                {filteredTasks.length === 0 ? (
                    <p className="text-gray-500">No tasks found.</p>
                ) : (
                    filteredTasks.map((t) => (
                        <Card key={t.id} className="p-6 mb-6 rounded-2xl shadow-2xl bg-white">
                            <h3 className="font-extrabold text-2xl text-teal-700 mb-2">{t.title}</h3>
                            <p className="text-gray-700 text-lg mb-3">{t.description}</p>
                            <div className="flex flex-wrap gap-4 text-md font-semibold">
                                {t.location && (
                                    <span className="bg-teal-100 px-3 py-1 rounded-lg text-teal-700">
                                        📍 {t.location}
                                    </span>
                                )}
                                {t.start_date && t.end_date && (
                                    <span className="bg-yellow-100 px-3 py-1 rounded-lg text-yellow-700">
                                        📅 {formatDate(t.start_date)} → {formatDate(t.end_date)}
                                    </span>
                                )}
                                {t.required_skills?.length && (
                                    <span className="bg-purple-100 px-3 py-1 rounded-lg text-purple-700">
                                        🛠 {t.required_skills.join(", ")}
                                    </span>
                                )}
                            </div>
                            <Button
                                label="View"
                                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg shadow"
                                onClick={() => navigate(`/dashboard/volunteer/tasks/${t.id}`)}
                            />
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default VolunteerDashboardHome;
