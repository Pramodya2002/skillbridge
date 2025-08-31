import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
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


    useEffect(() => {
        if (!volunteerId) return;
        setLoading(true);
        fetch(`http://localhost:8000/api/volunteers/${volunteerId}/matched-tasks`)
            .then((res) => res.json())
            .then((data) => setMatches(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [volunteerId]);


    if (!volunteerId) return <div>Please login as a volunteer to see matches.</div>;

    return (
        <Card title="Recommended Tasks" className="shadow-xl rounded-xl border-0">
            {loading ? (
                <p>Loading...</p>
            ) : matches.length === 0 ? (
                <p className="text-gray-500">No matches found.</p>
            ) : (
                matches.map((m) => (
                    <div
                        key={m.task.id}
                        className="p-4 mb-4 rounded-xl bg-white shadow hover:shadow-lg transition-all"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-teal-700 text-lg">
                                {m.task.title}{" "}
                                <span className="ml-2 text-sm text-gray-500">({m.score}%)</span>
                            </h3>
                            <Tag value="Matched" severity="success" />
                        </div>
                        <p className="text-gray-600">{m.task.description}</p>
                        <div className="flex flex-wrap text-sm text-gray-500 mt-2 gap-4">
                            {m.task.location && <span>📍 {m.task.location}</span>}
                            {m.task.start_date && m.task.end_date && (
                                <span>
                                    📅 {m.task.start_date} → {m.task.end_date}
                                </span>
                            )}
                            {m.task.required_skills?.length ? (
                                <span>🛠 {m.task.required_skills.join(", ")}</span>
                            ) : null}
                        </div>
                        <Button
                            label="Apply"
                            className="mt-3 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition duration-200"
                            onClick={() => navigate(`/dashboard/volunteer/tasks/${m.task.id}`)}
                        />

                    </div>
                ))
            )}
        </Card>
    );
};

const VolunteerDashboardHome: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const stats = { points: 2450, level: 7, tasksCompleted: 34, badgesEarned: 12 };
    const badges = [{ id: 1, name: "Green Thumb" }, { id: 2, name: "Team Player" }, { id: 3, name: "Mentor" }];
    const skillsProgress = [
        { skill: "Leadership", value: 85 },
        { skill: "Communication", value: 92 },
        { skill: "Problem Solving", value: 78 },
        { skill: "Teamwork", value: 90 },
    ];
    const recentCompletions = [
        { id: 1, task: "Food Bank Sorting", desc: "Organized donations for weekend distribution.", date: "Jan 15, 2025", feedback: "Sarah was efficient!" },
        { id: 2, task: "Senior Center Visit", desc: "Spent time reading with residents.", date: "Jan 12, 2025", feedback: "The residents loved Sarah!" },
    ];





    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-teal-600">Welcome back, {user.name || "Volunteer"}!</h2>
                <p className="text-gray-600 text-lg mt-2">Ready to make a difference today?</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-gradient-to-r from-teal-100 to-teal-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all rounded-xl text-center">
                    <h3 className="text-gray-700 font-semibold mb-2">Total Points</h3>
                    <p className="text-3xl font-bold text-teal-700">{stats.points}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-r from-green-100 to-green-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all rounded-xl text-center">
                    <h3 className="text-gray-700 font-semibold mb-2">Current Level</h3>
                    <p className="text-3xl font-bold text-green-700">Level {stats.level}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all rounded-xl text-center">
                    <h3 className="text-gray-700 font-semibold mb-2">Tasks Completed</h3>
                    <p className="text-3xl font-bold text-yellow-700">{stats.tasksCompleted}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-r from-purple-100 to-purple-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all rounded-xl text-center">
                    <h3 className="text-gray-700 font-semibold mb-2">Badges Earned</h3>
                    <p className="text-3xl font-bold text-purple-700">{stats.badgesEarned}</p>
                </Card>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Tasks (Rule-based) */}
                <VolunteerMatches />


                {/* Badges */}
                <Card title="Badges & Achievements" className="shadow-xl rounded-xl border-0">
                    <div className="flex gap-4 mb-4 flex-wrap">
                        {badges.map((b) => (
                            <div key={b.id} className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full text-purple-700 font-semibold shadow hover:shadow-md transition-all">
                                {b.name}
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-600 mb-2">550 XP until next level</p>
                    <ProgressBar value={55} showValue={false} className="h-3 rounded-full bg-teal-100" style={{ backgroundColor: '#E0F7FA' }}></ProgressBar>
                </Card>

                {/* Skills */}
                <Card title="Skills Progress" className="shadow-xl rounded-xl border-0">
                    {skillsProgress.map((s, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between mb-1 font-semibold text-gray-700">{s.skill} <span>{s.value}%</span></div>
                            <ProgressBar value={s.value} showValue={false} className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 shadow-inner"></ProgressBar>
                        </div>
                    ))}
                </Card>

                {/* Recent Completions */}
                <Card title="Recent Completions" className="shadow-xl rounded-xl border-0">
                    {recentCompletions.map((c) => (
                        <div key={c.id} className="p-4 mb-3 rounded-xl bg-white shadow hover:shadow-lg transform hover:-translate-y-1 transition-all">
                            <h3 className="font-semibold text-teal-700">{c.task}</h3>
                            <p className="text-gray-600">{c.desc}</p>
                            <p className="text-xs text-gray-500 mt-1">{c.date}</p>
                            <p className="italic text-gray-500 mt-1">“{c.feedback}”</p>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
};

export default VolunteerDashboardHome;
