import React from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";

const NonprofitDashboardLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: "Dashboard", path: "", icon: "pi pi-home" },
        // { label: "Opportunities", path: "opportunities", icon: "pi pi-briefcase" },
        // { label: "Volunteers", path: "volunteers", icon: "pi pi-users" },
        // { label: "Reports", path: "reports", icon: "pi pi-chart-line" },
        { label: "Tasks", path: "tasks", icon: "pi pi-list" },
        { label: "Profile", path: "profile", icon: "pi pi-user" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    const getCurrentPath = () => {
        const base = "/dashboard/nonprofit";
        const current = location.pathname;
        if (current === base || current === `${base}/`) return "";
        return current.replace(base + "/", "");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
            <Header />

            <div className="flex-1 flex relative">
                <aside className="fixed left-0 top-32 bottom-0 w-72 bg-white/70 backdrop-blur-2xl border-r border-white/50 shadow-2xl z-40 flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-emerald-500/10 pointer-events-none"></div>


                    <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = getCurrentPath() === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path ? `/dashboard/nonprofit/${item.path}` : "/dashboard/nonprofit"}
                                    className="block"
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
                                        ></i>

                                        <span className="relative z-10">{item.label}</span>

                                        {isActive && (
                                            <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl -z-10"></div>
                                        )}

                                        <div className="absolute inset-0 rounded-2xl bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 -z-10"></div>
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
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-72 pt-32 pb-24 px-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>


        </div>
    );
};

export default NonprofitDashboardLayout;