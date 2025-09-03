import React from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const menuItems = [
        { label: "Dashboard", path: "", icon: "pi pi-home" },
        { label: "Tasks", path: "tasks", icon: "pi pi-briefcase" },
        { label: "Profile", path: "profile", icon: "pi pi-user" },
        { label: "Logout", path: "/logout", icon: "pi pi-sign-out" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-gradient-to-b from-teal-600 to-teal-700 text-white shadow-lg flex flex-col">
                    <div className="p-6 text-2xl font-extrabold border-b border-teal-500">
                        SkillBridge
                    </div>

                    <nav className="flex-1 p-4 space-y-3">
                        {menuItems.map((item) => {
                            const isActive =
                                item.path === ""
                                    ? location.pathname === "/dashboard/volunteer"
                                    : location.pathname === `/dashboard/volunteer/${item.path}`;

                            if (item.label === "Logout") {
                                return (
                                    <Button
                                        key={item.path}
                                        label={item.label}
                                        icon={item.icon}
                                        className="w-full justify-start px-4 py-3 rounded-lg font-semibold text-left transition-all duration-200 bg-transparent text-white hover:bg-red-600 hover:text-white"
                                        onClick={handleLogout}
                                    />
                                );
                            }


                            return (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        label={item.label}
                                        icon={item.icon}
                                        className={`w-full justify-start px-4 py-3 rounded-lg font-semibold text-left transition-all duration-200
                        ${isActive
                                                ? "bg-teal-500 text-white border-l-4 border-yellow-400 scale-105"
                                                : "bg-transparent text-white hover:bg-teal-500 hover:text-white"
                                            }`}
                                    />
                                </Link>
                            );
                        })}
                    </nav>



                </aside>

                {/* Main content */}
                <main className="flex-1 p-8 bg-gray-100">

                    <Outlet />

                </main>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardLayout;
