import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface Application {
    id: number;
    volunteer_name: string;
    volunteer_email: string;
    task_title: string;
    task_id: number;
    status: string;
    applied_at: string;
    match_score?: number;
}

const HrApplicants: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.current?.show({
                    severity: "error",
                    summary: "Authentication Error",
                    detail: "No authentication token found. Please log in again.",
                    life: 5000,
                });
                return;
            }

            try {
                const res = await fetch("http://localhost:8000/api/hr/applications", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem("authToken");
                        window.location.href = "/login";
                        return;
                    }
                    if (res.status === 400) {
                        const data = await res.json();
                        throw new Error(data.error || "Bad request - check company name");
                    }
                    throw new Error("Failed to load applications");
                }

                const data = await res.json();
                setApplications(data);
            } catch (err: any) {
                console.error(err);
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: err.message || "Could not load applications.",
                    life: 5000,
                });
            }
        };

        fetchApplications();
    }, []);

    const statusTemplate = (row: Application) => {
        let gradient = "from-blue-500 to-cyan-600";
        let glow = "shadow-blue-500/60";

        if (row.status === "accepted") {
            gradient = "from-emerald-500 to-teal-600";
            glow = "shadow-emerald-500/60";
        }
        if (row.status === "rejected") {
            gradient = "from-red-500 to-rose-600";
            glow = "shadow-red-500/60";
        }
        if (row.status === "applied") {
            gradient = "from-amber-500 to-orange-600";
            glow = "shadow-amber-500/60";
        }

        return (
            <div className="flex justify-center">
                <Tag
                    value={row.status.toUpperCase()}
                    className={`px-5 py-2.5 sm:px-6 sm:py-3 text-base sm:text-lg font-bold rounded-full bg-gradient-to-r ${gradient} text-white shadow-lg ${glow} transform hover:scale-105 transition-all duration-300`}
                />
            </div>
        );
    };

    const actionTemplate = (row: Application) => {
        if (row.status !== "applied") {
            return (
                <div className="flex justify-center">
                    <span className="text-gray-500 font-medium">—</span>
                </div>
            );
        }

        return (
            <div className="flex justify-center gap-3">
                <Button
                    icon="pi pi-check"
                    tooltip="Accept"
                    className="p-button-rounded p-button-success p-button-text hover:scale-110 transition-transform duration-200"
                    onClick={() => handleStatusUpdate(row.id, "accepted")}
                />
                <Button
                    icon="pi pi-times"
                    tooltip="Reject"
                    className="p-button-rounded p-button-danger p-button-text hover:scale-110 transition-transform duration-200"
                    onClick={() => handleStatusUpdate(row.id, "rejected")}
                />
            </div>
        );
    };

    const handleStatusUpdate = async (appId: number, newStatus: "accepted" | "rejected") => {
        if (!confirm(`Are you sure you want to ${newStatus} this application?`)) return;

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`http://localhost:8000/api/task-applications/${appId}/update-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Update failed");

            setApplications((prev) =>
                prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
            );

            toast.current?.show({
                severity: newStatus === "accepted" ? "success" : "warn",
                summary: newStatus === "accepted" ? "Accepted" : "Rejected",
                detail: `Application has been ${newStatus}.`,
                life: 4000,
            });
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Action Failed",
                detail: "Could not update application status.",
                life: 5000,
            });
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen space-y-12 py-8 px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-teal-800 mb-4">
                    Applicant Management
                </h1>
                <p className="text-lg sm:text-2xl text-gray-700 font-medium max-w-4xl mx-auto">
                    Review and manage volunteer applications for your organization's opportunities
                </p>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
                <div className="text-left">
                    <p className="text-base sm:text-lg text-gray-600">
                        Total Applications: <span className="font-bold text-teal-700">{applications.length}</span>
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button
                        label="Refresh List"
                        icon="pi pi-refresh"
                        onClick={() => window.location.reload()}
                        className="px-8 py-4 bg-white border-2 border-teal-600 text-teal-700 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-teal-50 transition-all duration-300 w-full sm:w-auto"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="lg:hidden text-center text-sm text-gray-500 mb-4">
                            ← Scroll horizontally to view all columns →
                        </div>

                        <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
                            <DataTable
                                value={applications}
                                emptyMessage={
                                    <div className="text-center py-16 sm:py-20">
                                        <i className="pi pi-inbox text-7xl sm:text-9xl text-gray-300 mb-8"></i>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-500">No applications yet</p>
                                        <p className="text-lg sm:text-xl text-gray-400 mt-4">
                                            When volunteers apply to your tasks, they will appear here for review.
                                        </p>
                                    </div>
                                }
                                className="rounded-2xl overflow-hidden"
                                stripedRows
                                rowHover
                                tableStyle={{ minWidth: "50rem" }}
                                scrollable
                                scrollHeight="flexible"
                            >
                                {/* Volunteer Name */}
                                <Column
                                    field="volunteer_name"
                                    header="Volunteer"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-left font-semibold text-gray-800 text-sm sm:text-base border-r border-gray-200"
                                    body={(row) => <span className="text-teal-700">{row.volunteer_name}</span>}
                                    style={{ minWidth: "220px", width: "25%" }}
                                />

                                {/* Email */}
                                <Column
                                    field="volunteer_email"
                                    header="Email"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center text-gray-700 text-sm sm:text-base border-r border-gray-200 break-words"
                                    style={{ minWidth: "220px", width: "25%" }}
                                />

                                {/* Task Title */}
                                <Column
                                    field="task_title"
                                    header="Task / Opportunity"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-left font-medium text-gray-800 text-sm sm:text-base border-r border-gray-200"
                                    style={{ minWidth: "260px", width: "30%" }}
                                />

                                {/* Applied On */}
                                <Column
                                    field="applied_at"
                                    header="Applied On"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center font-bold text-teal-700 text-sm sm:text-base border-r border-gray-200"
                                    body={(row) => formatDate(row.applied_at)}
                                    style={{ minWidth: "160px", width: "15%" }}
                                />

                                {/* Status */}
                                <Column
                                    field="status"
                                    header="Status"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center border-r-2 border-gray-300"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 border-r border-gray-200"
                                    body={statusTemplate}
                                    style={{ minWidth: "140px", width: "12%" }}
                                />

                                {/* Actions */}
                                <Column
                                    header="Actions"
                                    headerClassName="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-bold py-5 sm:py-6 text-sm sm:text-lg text-center"
                                    bodyClassName="px-4 sm:px-6 py-5 sm:py-6 text-center"
                                    body={actionTemplate}
                                    style={{ minWidth: "120px", width: "10%" }}
                                />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-32 left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-15 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-15 animate-pulse delay-1000"></div>
            </div>

            <Toast ref={toast} position="top-right" />
        </div>
    );
};

export default HrApplicants;