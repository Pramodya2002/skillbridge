import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";

const VolunteerDashboardHome: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const stats = { points: 2450, level: 7, tasksCompleted: 34, badgesEarned: 12 };
    const matchedTasks = [
        { id: 1, title: "Community Garden Setup", desc: "Help set up raised beds for local families.", match: 95, time: "4 hours", location: "Downtown" },
        { id: 2, title: "Youth Coding Workshop", desc: "Teach programming to middle school students.", match: 88, time: "3 hours", location: "Tech Center" },
    ];
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
                {/* Matched Tasks */}
                <Card title="Matched Tasks" className="shadow-xl rounded-xl border-0">
                    {matchedTasks.map((task) => (
                        <div key={task.id} className="p-4 mb-4 rounded-xl bg-white shadow hover:shadow-lg transform hover:-translate-y-1 transition-all">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-teal-700 text-lg">{task.title}</h3>
                                <Tag value={`${task.match}% Match`} severity="success" className="font-bold text-sm" />
                            </div>
                            <p className="text-gray-600">{task.desc}</p>
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>⏱ {task.time}</span>
                                <span>📍 {task.location}</span>
                            </div>
                            <Button label="Apply" className="mt-3 bg-teal-500 hover:bg-teal-600 text-white font-bold" />
                        </div>
                    ))}
                </Card>

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
