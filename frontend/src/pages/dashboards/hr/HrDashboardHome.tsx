import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";

interface EmployeeEngagement {
    id: number;
    name: string;
    email: string;
    completed_tasks: number;
    total_hours: number;
    distinct_skills: number;
    badges: number;
    engagement_score: number;
}

const HrDashboardHome: React.FC = () => {
    const [employees, setEmployees] = useState<EmployeeEngagement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = React.useRef<Toast>(null);

    const csrGoalProgress = 68;

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("No authentication token found. Please log in again.");
            setLoading(false);
            return;
        }

        fetch("http://localhost:8000/api/hr/employees/engagement", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem("authToken");
                        window.location.href = "/login";
                        return;
                    }
                    if (res.status === 400) {
                        return res.json().then((data) => {
                            throw new Error(data.error || "Bad request");
                        });
                    }
                    throw new Error("Failed to load engagement data");
                }
                return res.json();
            })
            .then((data) => {
                setEmployees(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching engagement data:", err);
                setError(err.message || "Failed to load employee engagement data.");
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: err.message || "Could not load engagement data.",
                    life: 5000,
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const scoreTemplate = (row: EmployeeEngagement) => {
        let severity: "success" | "warning" | "danger" = "danger";
        if (row.engagement_score >= 50) severity = "success";
        else if (row.engagement_score >= 20) severity = "warning";

        return (
            <Tag
                value={row.engagement_score.toString()}
                severity={severity}
                className="text-lg font-bold px-4 py-2"
            />
        );
    };

    return (
        <div className="space-y-10 pb-12">
            {/* Welcome & CSR Goal Progress */}
            <div className="bg-gradient-to-br from-white/90 to-teal-50/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 pointer-events-none" />
                <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-emerald-700 mb-6">
                    HR Manager Dashboard
                </h1>
                <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
                    Monitor volunteer impact, track employee engagement, and support your organization's CSR and HR objectives.
                </p>

                {/* CSR Goal Progress Bar */}
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-teal-800">2026 CSR Volunteering Goal Progress</span>
                        <span className="text-lg font-bold text-emerald-700">{csrGoalProgress}%</span>
                    </div>
                    <ProgressBar
                        value={csrGoalProgress}
                        showValue={false}
                        className="h-5 bg-gray-200 rounded-full"
                        pt={{
                            root: { className: "bg-gray-200 rounded-full overflow-hidden" },
                            value: { className: "bg-gradient-to-r from-teal-500 to-emerald-600 h-full" },
                        }}
                    />
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/50 p-6 text-center transform hover:scale-105 transition-all duration-300">
                    <i className="pi pi-users text-5xl text-teal-600 mb-4"></i>
                    <h3 className="text-xl font-bold text-teal-800">Active Volunteers</h3>
                    <p className="text-4xl font-black text-teal-700 mt-2">24</p>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/50 p-6 text-center transform hover:scale-105 transition-all duration-300">
                    <i className="pi pi-briefcase text-5xl text-purple-600 mb-4"></i>
                    <h3 className="text-xl font-bold text-teal-800">Ongoing Tasks</h3>
                    <p className="text-4xl font-black text-purple-600 mt-2">8</p>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/50 p-6 text-center transform hover:scale-105 transition-all duration-300">
                    <i className="pi pi-clock text-5xl text-amber-600 mb-4"></i>
                    <h3 className="text-xl font-bold text-teal-800">Impact Hours</h3>
                    <p className="text-4xl font-black text-amber-600 mt-2">342</p>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/50 p-6 text-center transform hover:scale-105 transition-all duration-300">
                    <i className="pi pi-inbox text-5xl text-pink-600 mb-4"></i>
                    <h3 className="text-xl font-bold text-teal-800">Pending Applications</h3>
                    <p className="text-4xl font-black text-pink-600 mt-2">5</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Link
                    to="/dashboard/hr/applicants"
                    className="group bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/50 p-8 text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                    <i className="pi pi-users text-6xl text-teal-600 mb-6 block"></i>
                    <h3 className="text-2xl font-bold text-teal-800 mb-3">Review Applicants</h3>
                    <p className="text-gray-600">View and manage pending applications</p>
                </Link>

                <Link
                    to="/dashboard/hr/tasks"
                    className="group bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/50 p-8 text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                    <i className="pi pi-plus-circle text-6xl text-emerald-600 mb-6 block"></i>
                    <h3 className="text-2xl font-bold text-teal-800 mb-3">Create New Task</h3>
                    <p className="text-gray-600">Post new volunteering opportunities</p>
                </Link>

                <Link
                    to="/dashboard/hr/reports"
                    className="group bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/50 p-8 text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                    <i className="pi pi-chart-bar text-6xl text-purple-600 mb-6 block"></i>
                    <h3 className="text-2xl font-bold text-teal-800 mb-3">Generate Reports</h3>
                    <p className="text-gray-600">Export CSR & engagement analytics</p>
                </Link>
            </div>

            {/* Employee Engagement Table */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse delay-1000"></div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-teal-800 mb-8 flex items-center gap-4 relative z-10">
                    <i className="pi pi-users text-5xl text-teal-600"></i>
                    Employee Engagement Overview
                </h2>

                {loading ? (
                    <div className="text-center py-16 relative z-10">
                        <i className="pi pi-spin pi-spinner text-7xl text-teal-600 mb-6"></i>
                        <p className="text-xl font-semibold text-gray-700">Loading employee engagement data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-600 relative z-10">
                        <i className="pi pi-exclamation-triangle text-7xl mb-6"></i>
                        <p className="text-2xl font-bold mb-4">{error}</p>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                            Please ensure your company name is set in your profile and that volunteers from your company have completed tasks.
                        </p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-16 text-gray-600 relative z-10">
                        <i className="pi pi-exclamation-triangle text-7xl mb-6 text-amber-500"></i>
                        <p className="text-2xl font-bold text-teal-800 mb-4">No matching employees found</p>
                        <p className="text-lg mb-3">
                            No volunteers from your company have completed tasks yet, or no volunteers are linked to your company name.
                        </p>
                        <p className="text-base text-gray-500">
                            Make sure volunteers have entered the <strong>exact same company name</strong> in their profile.
                        </p>
                    </div>
                ) : (
                    <div className="relative z-10">
                        {/* Mobile scroll hint */}
                        <div className="lg:hidden text-center text-sm text-gray-500 mb-4 italic">
                            ← Scroll horizontally to view all columns →
                        </div>

                        <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
                            <DataTable
                                value={employees}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 15, 20]}
                                tableStyle={{ minWidth: "50rem" }}
                                className="rounded-2xl overflow-hidden p-datatable-sm p-datatable-striped"
                                stripedRows
                                rowHover
                                scrollable
                                scrollHeight="flexible"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                            >
                                {/* Name */}
                                <Column
                                    field="name"
                                    header="Name"
                                    sortable
                                    filter
                                    filterPlaceholder="Search name"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-left font-semibold text-teal-800 text-sm sm:text-base border-r border-gray-200"
                                    body={(row) => <span className="font-medium">{row.name}</span>}
                                    style={{ minWidth: "220px", width: "22%" }}
                                />

                                {/* Email */}
                                <Column
                                    field="email"
                                    header="Email"
                                    sortable
                                    filter
                                    filterPlaceholder="Search email"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center text-gray-700 text-sm sm:text-base border-r border-gray-200 break-words"
                                    style={{ minWidth: "240px", width: "25%" }}
                                />

                                {/* Tasks Completed */}
                                <Column
                                    field="completed_tasks"
                                    header="Tasks Completed"
                                    sortable
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center font-bold text-emerald-700 text-sm sm:text-base border-r border-gray-200"
                                    style={{ minWidth: "140px", width: "12%" }}
                                />

                                {/* Hours Logged */}
                                <Column
                                    field="total_hours"
                                    header="Hours Logged"
                                    sortable
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center font-bold text-teal-700 text-sm sm:text-base border-r border-gray-200"
                                    style={{ minWidth: "140px", width: "12%" }}
                                />

                                {/* Skills Used */}
                                <Column
                                    field="distinct_skills"
                                    header="Skills Used"
                                    sortable
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center font-bold text-purple-700 text-sm sm:text-base border-r border-gray-200"
                                    style={{ minWidth: "140px", width: "12%" }}
                                />

                                {/* Badges Earned */}
                                <Column
                                    field="badges"
                                    header="Badges Earned"
                                    sortable
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center font-bold text-pink-700 text-sm sm:text-base border-r border-gray-200"
                                    style={{ minWidth: "140px", width: "10%" }}
                                />

                                {/* Engagement Score */}
                                <Column
                                    field="engagement_score"
                                    header="Engagement Score"
                                    sortable
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center"
                                    body={scoreTemplate}
                                    style={{ minWidth: "160px", width: "12%" }}
                                />
                            </DataTable>
                        </div>
                    </div>
                )}
            </div>


            <Outlet />

        </div>
    );
};

export default HrDashboardHome;