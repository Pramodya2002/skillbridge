import React, { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";

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
}

type Match = { task: Task; score: number; reasons: string[] };

const VolunteerMatches: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const volunteerId = user?.volunteer_id || user?.id;

    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    useEffect(() => {
        if (!volunteerId) return;

        Promise.all([
            fetch(`http://localhost:8000/api/volunteers/${volunteerId}/matched-tasks`).then(res => res.json()),
            fetch(`http://localhost:8000/api/volunteers/${volunteerId}/tasks`).then(res => res.json()),
            fetch(`http://localhost:8000/api/tasks`).then(res => res.json()),
        ])
            .then(([matches, applied]) => {
                const appliedTaskIds = applied.map((a: any) => a.task.id);
                const parsedMatches = matches.map((m: any) => ({
                    task: {
                        ...m.task,
                        required_skills: Array.isArray(m.task.required_skills)
                            ? m.task.required_skills
                            : JSON.parse(m.task.required_skills || "[]"),
                        cause: m.task.cause || null,
                    },
                    score: m.score,
                    reasons: m.reasons || []
                }));
                setMatches(parsedMatches.filter((m: any) => !appliedTaskIds.includes(m.task.id)));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [volunteerId]);

    if (!volunteerId) return <div className="text-center text-gray-500 text-xl">Please login as a volunteer to see matches.</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 text-center">
                Your Perfect Matches
            </h2>

            {loading ? (
                <div className="text-center py-20">
                    <i className="pi pi-spin pi-spinner text-6xl text-teal-600"></i>
                </div>
            ) : matches.length === 0 ? (
                <div className="text-center py-20 bg-white/60 backdrop-blur rounded-3xl border border-white/50">
                    <p className="text-2xl font-bold text-gray-500">No perfect matches yet</p>
                    <p className="text-gray-400 mt-2">Keep exploring — your ideal opportunity is coming!</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {matches.map((m) => (
                        <div
                            key={m.task.id}
                            className="group relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform hover:scale-105 transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative z-10 p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-3xl font-black text-teal-900 pr-4">{m.task.title}</h3>
                                    <div className="relative">
                                        <Tag
                                            value={`${m.score}% Match`}
                                            className={`px-8 py-4 text-2xl font-black rounded-full bg-gradient-to-r ${m.score >= 80 ? "from-emerald-500 to-teal-600" :
                                                m.score >= 60 ? "from-blue-500 to-cyan-600" :
                                                    "from-amber-500 to-orange-600"
                                                } text-white shadow-2xl animate-pulse`}
                                        />
                                        <div className="absolute inset-0 rounded-full bg-white/40 blur-xl animate-ping"></div>
                                    </div>
                                </div>

                                <p className="text-gray-700 text-lg leading-relaxed mb-6">{m.task.description}</p>

                                <div className="flex flex-wrap gap-4 mb-6">
                                    {m.task.location && (
                                        <span className="px-5 py-3 bg-teal-100/80 backdrop-blur rounded-2xl text-teal-800 font-bold flex items-center gap-2">
                                            Location: {m.task.location}
                                        </span>
                                    )}
                                    {(m.task.start_date || m.task.end_date) && (
                                        <span className="px-5 py-3 bg-amber-100/80 backdrop-blur rounded-2xl text-amber-800 font-bold">
                                            Task Period: {formatDate(m.task.start_date)} ➡️ {formatDate(m.task.end_date)}
                                        </span>
                                    )}
                                    {m.task.required_skills && m.task.required_skills.length > 0 && (
                                        <span className="px-5 py-3 bg-purple-100/80 backdrop-blur rounded-2xl text-purple-800 font-bold">
                                            Skills: {m.task.required_skills.map(s => s.skill).join(" · ")}
                                        </span>
                                    )}
                                    {m.task.cause && (
                                        <span className="px-5 py-3 bg-pink-100/80 backdrop-blur rounded-2xl text-pink-800 font-bold">
                                            Cause: {m.task.cause}
                                        </span>
                                    )}
                                </div>

                                {m.reasons.length > 0 && (
                                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200">
                                        <p className="font-bold text-teal-800 mb-3">Why this is perfect for you:</p>
                                        <ul className="space-y-2">
                                            {m.reasons.map((r, i) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-700">
                                                    <span className="text-teal-600 mt-1">✅</span>
                                                    <span>{r}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={() => navigate(`/dashboard/volunteer/tasks/${m.task.id}`)}
                                        className="group/button relative px-10 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            View Opportunity
                                        </span>
                                        <div className="absolute inset-0 bg-white/30 scale-0 group-hover/button:scale-150 transition-transform duration-700 rounded-2xl"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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

    useEffect(() => {
        if (!volunteerId) return;

        fetch("http://localhost:8000/api/tasks")
            .then(res => res.json())
            .then(data => {
                const parsedTasks = data.map((t: any) => ({
                    ...t,
                    required_skills: Array.isArray(t.required_skills) ? t.required_skills : JSON.parse(t.required_skills || "[]"),
                    cause: t.cause || null,
                }));
                setAllTasks(parsedTasks);
            });

        fetch(`http://localhost:8000/api/volunteers/${volunteerId}/applied-tasks`)
            .then(res => res.json())
            .then((applied: any[]) => {
                setAppliedTaskIds(applied.map(a => a.task_id));
            });
    }, [volunteerId]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const titles = Array.from(new Set(allTasks.map(t => t.title))).map(t => ({ label: t, value: t }));
    const locations = Array.from(new Set(allTasks.map(t => t.location))).map(l => ({ label: l, value: l }));
    const skills = Array.from(new Set(allTasks.flatMap(t => t.required_skills?.map(s => s.skill) || []))).map(s => ({ label: s, value: s }));

    const filteredTasks = allTasks
        .filter(task => !appliedTaskIds.includes(task.id))
        .filter(task => {
            const matchTitle = searchTitle ? task.title.includes(searchTitle) : true;
            const matchLocation = searchLocation ? task.location === searchLocation : true;
            const matchSkill = searchSkill ? task.required_skills?.some(s => s.skill === searchSkill) : true;
            return matchTitle && matchLocation && matchSkill;
        });

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-12 px-6">
            <div className="text-center mb-16">
                <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-4">
                    Welcome back, {user.name || "Volunteer"}!
                </h1>
                <p className="text-2xl text-gray-700 font-medium">Your impact starts here</p>
            </div>

            <div className="max-w-7xl mx-auto mb-20">
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 p-10 md:p-16">
                    <VolunteerMatches />
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-10 md:p-14">
                    <h2 className="text-5xl font-black text-teal-800 text-center mb-12">
                        Explore All Opportunities
                    </h2>

                    {/* Filters  */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Task Title Filter */}
                            <div className="group">
                                <label className="block text-lg font-bold text-teal-800 mb-3 flex items-center gap-2">
                                    <i className="pi pi-search text-teal-600"></i>
                                    Task Title
                                </label>
                                <Dropdown
                                    value={searchTitle}
                                    options={titles}
                                    onChange={(e) => setSearchTitle(e.value)}
                                    placeholder="Search by task title..."
                                    filter
                                    showClear={!!searchTitle}
                                    className="w-full h-10 text-lg font-medium border-2 border-gray-300 rounded-2xl focus-within:border-teal-500 transition-all duration-300 shadow-sm hover:border-teal-400"
                                    panelClassName="bg-white shadow-2xl border border-gray-200 rounded-2xl mt-2 overflow-hidden"
                                    itemTemplate={(option) => (
                                        <div className="p-3 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer">
                                            {option.label}
                                        </div>
                                    )}
                                    pt={{
                                        input: { className: "h-full text-lg placeholder-gray-500" },
                                        clearIcon: { className: "text-gray-400 hover:text-teal-600" }
                                    }}
                                />
                            </div>

                            {/* Location Filter */}
                            <div className="group">
                                <label className="block text-lg font-bold text-teal-800 mb-3 flex items-center gap-2">
                                    <i className="pi pi-map-marker text-teal-600"></i>
                                    Location
                                </label>
                                <Dropdown
                                    value={searchLocation}
                                    options={locations}
                                    onChange={(e) => setSearchLocation(e.value)}
                                    placeholder="Any location"
                                    showClear={!!searchLocation}
                                    className="w-full h-10 text-lg font-medium border-2 border-gray-300 rounded-2xl focus-within:border-teal-500 transition-all duration-300 shadow-sm hover:border-teal-400"
                                    pt={{
                                        input: { className: "h-full text-lg placeholder-gray-500" }
                                    }}
                                    panelClassName="bg-white shadow-2xl border border-gray-200 rounded-2xl mt-2"
                                />
                            </div>

                            {/* Required Skill Filter */}
                            <div className="group">
                                <label className="block text-lg font-bold text-teal-800 mb-3 flex items-center gap-2">
                                    <i className="pi pi-star-fill text-purple-600"></i>
                                    Required Skill
                                </label>
                                <Dropdown
                                    value={searchSkill}
                                    options={skills}
                                    onChange={(e) => setSearchSkill(e.value)}
                                    placeholder="Any skill"
                                    showClear={!!searchSkill}
                                    className="w-full h-10 text-lg font-medium border-2 border-gray-300 rounded-2xl focus-within:border-teal-500 transition-all duration-300 shadow-sm hover:border-teal-400"
                                    pt={{
                                        input: { className: "h-full text-lg placeholder-gray-500" }
                                    }}
                                    panelClassName="bg-white shadow-2xl border border-gray-200 rounded-2xl mt-2"
                                />
                            </div>
                        </div>



                        {(searchTitle || searchLocation || searchSkill) && (
                            <div className="mt-8 flex flex-wrap gap-3 justify-center">
                                {searchTitle && (
                                    <div className="px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-full shadow-lg flex items-center gap-3">
                                        <span>Title: {searchTitle}</span>
                                        <button onClick={() => setSearchTitle("")} className="hover:scale-110 transition">
                                            <i className="pi pi-times-circle"></i>
                                        </button>
                                    </div>
                                )}
                                {searchLocation && (
                                    <div className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg flex items-center gap-3">
                                        <span>Location: {searchLocation}</span>
                                        <button onClick={() => setSearchLocation("")} className="hover:scale-110 transition">
                                            <i className="pi pi-times-circle"></i>
                                        </button>
                                    </div>
                                )}
                                {searchSkill && (
                                    <div className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-full shadow-lg flex items-center gap-3">
                                        <span>Skill: {searchSkill}</span>
                                        <button onClick={() => setSearchSkill("")} className="hover:scale-110 transition">
                                            <i className="pi pi-times-circle"></i>
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        setSearchTitle("");
                                        setSearchLocation("");
                                        setSearchSkill("");
                                    }}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Task Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {filteredTasks.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-white/70 backdrop-blur rounded-3xl border border-gray-200/50">
                                <p className="text-2xl font-bold text-gray-500">No tasks match your filters</p>
                            </div>
                        ) : (
                            filteredTasks.map((t) => (

                                <div
                                    key={t.id}
                                    className="group relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform hover:scale-105 transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                    <div className="relative z-10 p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-3xl font-black text-teal-900 pr-4">{t.title}</h3>

                                        </div>

                                        <p className="text-gray-700 text-lg leading-relaxed mb-6">{t.description}</p>

                                        <div className="flex flex-wrap gap-4 mb-6">
                                            {t.location && (
                                                <span className="px-5 py-3 bg-teal-100/80 backdrop-blur rounded-2xl text-teal-800 font-bold flex items-center gap-2">
                                                    Location: {t.location}
                                                </span>
                                            )}
                                            {(t.start_date || t.end_date) && (
                                                <span className="px-5 py-3 bg-amber-100/80 backdrop-blur rounded-2xl text-amber-800 font-bold">
                                                    Task Period: {formatDate(t.start_date)} ➡️ {formatDate(t.end_date)}
                                                </span>
                                            )}
                                            {t.required_skills && t.required_skills.length > 0 && (
                                                <span className="px-5 py-3 bg-purple-100/80 backdrop-blur rounded-2xl text-purple-800 font-bold">
                                                    Skills: {t.required_skills.map(s => s.skill).join(" · ")}
                                                </span>
                                            )}
                                            {t.cause && (
                                                <span className="px-5 py-3 bg-pink-100/80 backdrop-blur rounded-2xl text-pink-800 font-bold">
                                                    Cause: {t.cause}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={() => navigate(`/dashboard/volunteer/tasks/${t.id}`)}
                                                className="group/button relative px-10 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center gap-3">
                                                    View Opportunity
                                                </span>
                                                <div className="absolute inset-0 bg-white/30 scale-0 group-hover/button:scale-150 transition-transform duration-700 rounded-2xl"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default VolunteerDashboardHome;