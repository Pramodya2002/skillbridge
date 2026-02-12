import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Button } from "primereact/button";
import Header from "../components/Header";


const HrDashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { label: "Dashboard", path: "", icon: "pi pi-home" },
        { label: "Applicants", path: "applicants", icon: "pi pi-users" },
        { label: "Tasks", path: "tasks", icon: "pi pi-briefcase" },
        { label: "Reports", path: "reports", icon: "pi pi-chart-line" },
        { label: "Profile", path: "profile", icon: "pi pi-user" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getCurrentPath = () => {
        const base = "/dashboard/hr";
        const current = location.pathname;
        if (current === base || current === `${base}/`) return "";
        return current.replace(base + "/", "");
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
            <Header />

            {/* Mobile Menu Toggle */}
            {!sidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden fixed left-4 top-24 z-50 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center text-teal-700 text-2xl hover:bg-teal-50 hover:scale-110 transition-all duration-200"
                    aria-label="Open menu"
                >
                    <i className="pi pi-bars"></i>
                </button>
            )}

            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 bottom-0 w-72 bg-white/80 backdrop-blur-2xl border-r border-white/50 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:top-32 lg:z-40
                `}
            >
                <div className="lg:hidden absolute top-4 right-4 z-10">
                    <button
                        onClick={toggleSidebar}
                        className="w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-xl flex items-center justify-center text-teal-700 text-xl hover:bg-teal-50 hover:scale-110 transition-all duration-200"
                        aria-label="Close menu"
                    >
                        <i className="pi pi-times"></i>
                    </button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-emerald-500/10 pointer-events-none" />

                <nav className="flex-1 p-6 pt-16 lg:pt-6 space-y-3 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = getCurrentPath() === item.path;


                        return (
                            <Link
                                key={item.path}
                                to={item.path ? `/dashboard/hr/${item.path}` : "/dashboard/hr"}
                                className="block"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <div
                                    className={`group relative flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 font-semibold text-lg
                                        ${isActive
                                            ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xl scale-105"
                                            : "text-gray-700 hover:bg-white/80 hover:text-teal-700 hover:shadow-lg"
                                        }`}
                                >
                                    <i
                                        className={`${item.icon} text-2xl transition-all duration-300`}
                                        style={{
                                            color: isActive ? "white" : "#0d9488",
                                            filter: isActive ? "none" : "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
                                        }}
                                    />
                                    <span className="relative z-10">{item.label}</span>

                                    {isActive && (
                                        <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl -z-10" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-6 border-t border-white/30 bg-white/50 backdrop-blur">
                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        onClick={handleLogout}
                        className="w-full flex justify-center items-center gap-3 py-5 text-lg font-bold rounded-2xl 
                                            bg-gradient-to-r from-red-600 to-rose-600 text-white 
                                            shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0
                                            !pl-10"
                        pt={{
                            icon: { className: "text-xl -ml-2" },
                            label: { className: "font-bold" }
                        }}
                    />
                </div>

                {/* Footer copyright */}
                <div className="p-6 border-t border-white/30 bg-white/50 backdrop-blur text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} SkillBridge
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pt-32 pb-24 px-6 sm:px-8 lg:ml-72 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children || <Outlet />}
                </div>
            </main>


        </div>
    );
};

export default HrDashboardLayout;