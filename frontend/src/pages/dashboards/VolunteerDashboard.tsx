import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";

const VolunteerDashboard: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const stats = {
        points: 2450,
        level: 7,
        tasksCompleted: 34,
        badgesEarned: 12,
    };

    const matchedTasks = [
        { id: 1, title: "Community Garden Setup", desc: "Help set up raised beds and plant vegetables for local families.", match: 95, time: "4 hours", location: "Downtown" },
        { id: 2, title: "Youth Coding Workshop", desc: "Teach basic programming concepts to middle school students.", match: 88, time: "3 hours", location: "Tech Center" },
    ];

    const badges = [
        { id: 1, name: "Green Thumb" },
        { id: 2, name: "Team Player" },
        { id: 3, name: "Mentor" },
    ];

    const skillsProgress = [
        { skill: "Leadership", value: 85 },
        { skill: "Communication", value: 92 },
        { skill: "Problem Solving", value: 78 },
        { skill: "Teamwork", value: 90 },
    ];

    const recentCompletions = [
        { id: 1, task: "Food Bank Sorting", desc: "Organized and sorted donations for weekend distribution.", date: "Jan 15, 2025", feedback: "Sarah was incredibly organized and efficient!" },
        { id: 2, task: "Senior Center Visit", desc: "Spent time reading and playing games with residents.", date: "Jan 12, 2025", feedback: "The residents loved having Sarah visit!" },
    ];

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Welcome back, {user.name || "Volunteer"}!</h2>
                <p className="text-gray-600">Ready to make a difference today?</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card><h3>Total Points</h3><p className="text-2xl">{stats.points}</p></Card>
                <Card><h3>Current Level</h3><p className="text-2xl">Level {stats.level}</p></Card>
                <Card><h3>Tasks Completed</h3><p className="text-2xl">{stats.tasksCompleted}</p></Card>
                <Card><h3>Badges Earned</h3><p className="text-2xl">{stats.badgesEarned}</p></Card>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Tasks */}
                <Card title="Matched Tasks">
                    {matchedTasks.map((task) => (
                        <div key={task.id} className="p-4 border rounded-lg bg-white shadow-sm mb-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">{task.title}</h3>
                                <Tag value={`${task.match}% Match`} severity="success" />
                            </div>
                            <p className="text-sm text-gray-600">{task.desc}</p>
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>⏱ {task.time}</span>
                                <span>📍 {task.location}</span>
                            </div>
                            <Button label="Apply" size="small" className="mt-2" />
                        </div>
                    ))}
                </Card>

                {/* Badges & Achievements */}
                <Card title="Badges & Achievements">
                    <div className="flex gap-4 mb-4">
                        {badges.map((b) => (
                            <div key={b.id} className="px-3 py-2 bg-gray-100 rounded-lg text-center flex-1">{b.name}</div>
                        ))}
                    </div>
                    <p className="text-gray-600">550 XP until next level</p>
                    <ProgressBar value={55} showValue={false}></ProgressBar>
                </Card>

                {/* Skills Progress */}
                <Card title="Skills Progress">
                    {skillsProgress.map((s, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between">
                                <span>{s.skill}</span>
                                <span>{s.value}%</span>
                            </div>
                            <ProgressBar value={s.value} showValue={false}></ProgressBar>
                        </div>
                    ))}
                </Card>

                {/* Recent Completions */}
                <Card title="Recent Completions">
                    {recentCompletions.map((c) => (
                        <div key={c.id} className="p-4 border rounded-lg bg-white shadow-sm mb-3">
                            <h3 className="font-semibold">{c.task}</h3>
                            <p className="text-sm text-gray-600">{c.desc}</p>
                            <p className="text-xs text-gray-500 mt-1">{c.date}</p>
                            <p className="italic text-gray-500">“{c.feedback}”</p>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
