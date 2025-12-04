import React from "react";
import { Link } from "react-router-dom";

const DashboardHome: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const stats = [
        { label: "Active Postings", value: 12, gradient: "from-teal-500 to-emerald-600", icon: "pi pi-briefcase", color: "teal" },
        { label: "Registered Volunteers", value: 48, gradient: "from-purple-500 to-pink-600", icon: "pi pi-users", color: "purple" },
        { label: "Upcoming Events", value: 5, gradient: "from-amber-500 to-orange-600", icon: "pi pi-calendar", color: "amber" },
        { label: "Pending Reviews", value: 3, gradient: "from-red-500 to-rose-600", icon: "pi pi-exclamation-triangle", color: "red" },
    ];

    const quickActions = [
        { label: "Post Opportunity", icon: "pi pi-plus-circle", to: "/dashboard/nonprofit/opportunities/new", gradient: "from-teal-600 to-emerald-600" },
        { label: "View Volunteers", icon: "pi pi-users", to: "/dashboard/nonprofit/volunteers", gradient: "from-purple-600 to-pink-600" },
        { label: "Create Event", icon: "pi pi-calendar-plus", to: "/dashboard/nonprofit/events/new", gradient: "from-amber-500 to-orange-600" },
        { label: "View Reports", icon: "pi pi-chart-line", to: "/dashboard/nonprofit/reports", gradient: "from-red-600 to-rose-600" },
    ];

    return (
        <div className="space-y-12 py-8">
            {/* Hero Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700 p-12 text-white shadow-2xl">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                <div className="relative z-10 max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-black leading-tight">
                        Welcome back, <span className="text-yellow-300">{user.name || "Nonprofit Leader"}!</span>
                    </h1>
                    <p className="text-xl md:text-2xl mt-4 font-medium opacity-90">
                        You're making a real impact. Here's your organization's overview.
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex -space-x-4">
                            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur border-4 border-white/50 flex items-center justify-center text-2xl font-bold">A</div>
                            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur border-4 border-white/50 flex items-center justify-center text-2xl font-bold">B</div>
                            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur border-4 border-white/50 flex items-center justify-center text-2xl font-bold">C</div>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 border-4 border-white flex items-center justify-center text-2xl font-bold shadow-lg">+</div>
                        </div>
                        <p className="text-lg opacity-90">48 volunteers ready to help</p>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mb-32"></div>
            </div>

            {/* Stats Grid - Glassmorphism Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl transform hover:scale-105 transition-all duration-500"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

                        <div className="relative z-10 p-8 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <i className={`${stat.icon} text-4xl opacity-90`}></i>
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                    <i className="pi pi-arrow-up text-xl"></i>
                                </div>
                            </div>
                            <p className="text-lg font-medium opacity-90">{stat.label}</p>
                            <p className="text-6xl font-black mt-3">{stat.value}</p>
                            <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full bg-white/60 rounded-full animate-pulse" style={{ width: `${Math.min(stat.value * 3, 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="absolute inset-0 rounded-3xl bg-white/10 blur-xl scale-0 group-hover:scale-150 transition-transform duration-700 -z-10"></div>
                    </div>
                ))}
            </div>

            {/* Quick Actions - Premium Floating Cards */}
            <div>
                <h2 className="text-4xl font-black text-teal-900 mb-8 text-center">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.to}
                            className="group relative block transform hover:-translate-y-4 transition-all duration-500"
                        >
                            <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/70 shadow-2xl p-10 text-center hover:shadow-3xl">
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative z-10">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl border-4 border-white/60 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                        <i className={`${action.icon} text-5xl text-white drop-shadow-lg`}></i>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-white transition-colors">
                                        {action.label}
                                    </h3>
                                    <p className="mt-3 text-gray-600 group-hover:text-white/90 font-medium">
                                        Click to get started
                                    </p>
                                </div>

                                <div className="absolute inset-0 rounded-3xl bg-white/20 blur-2xl scale-0 group-hover:scale-150 transition-transform duration-700 -z-10"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Motivational Footer */}
            <div className="text-center py-12">
                <p className="text-3xl font-bold text-teal-800">
                    Every opportunity you post changes lives.
                </p>
                <p className="text-xl text-gray-600 mt-4">
                    Thank you for building a better world.
                </p>
            </div>
        </div>
    );
};

export default DashboardHome;