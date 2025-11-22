import React from "react";
import { Card } from "primereact/card";

const DashboardHome: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const buttonClasses =
        "flex items-center gap-2 font-semibold py-2 px-4 rounded shadow transition-all duration-200 text-white";

    return (
        <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="bg-white rounded-2xl shadow-md p-6 animate-fadeIn">
                <h2 className="text-3xl font-bold mb-2 text-teal-700">
                    Welcome, {user.name || "Nonprofit Admin"}!
                </h2>
                <p className="text-gray-600 mb-4">
                    Here's an overview of your organization dashboard.
                </p>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-lg p-5">
                    <h3 className="text-xl font-semibold">Opportunities</h3>
                    <p className="text-3xl font-bold mt-2">12</p>
                    <p className="text-sm mt-1">Active postings</p>
                </Card>
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-5">
                    <h3 className="text-xl font-semibold">Volunteers</h3>
                    <p className="text-3xl font-bold mt-2">48</p>
                    <p className="text-sm mt-1">Registered</p>
                </Card>
                <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl shadow-lg p-5">
                    <h3 className="text-xl font-semibold">Events</h3>
                    <p className="text-3xl font-bold mt-2">5</p>
                    <p className="text-sm mt-1">Upcoming</p>
                </Card>
                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg p-5">
                    <h3 className="text-xl font-semibold">Reports</h3>
                    <p className="text-3xl font-bold mt-2">3</p>
                    <p className="text-sm mt-1">Pending review</p>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white rounded-2xl shadow-md p-6 animate-fadeIn">
                <h3 className="text-2xl font-semibold mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <button className={`${buttonClasses} bg-teal-600 hover:bg-teal-700`}>
                        <i className="pi pi-plus"></i>
                        Post Opportunity
                    </button>
                    <button className={`${buttonClasses} bg-purple-600 hover:bg-purple-700`}>
                        <i className="pi pi-users"></i>
                        View Volunteers
                    </button>
                    <button className={`${buttonClasses} bg-yellow-500 hover:bg-yellow-600`}>
                        <i className="pi pi-calendar"></i>
                        Create Event
                    </button>
                    <button className={`${buttonClasses} bg-red-600 hover:bg-red-700`}>
                        <i className="pi pi-chart-line"></i>
                        View Reports
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default DashboardHome;
