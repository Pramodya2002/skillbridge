import React from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

const VolunteerTasks: React.FC = () => {
    const tasks = [
        { id: 1, title: "Fundraising Campaign", org: "Help4All", deadline: "2025-09-01", status: "Applied" },
        { id: 2, title: "Event Logistics", org: "Youth Org", deadline: "2025-09-15", status: "Completed" },
    ];

    const statusTemplate = (row: any) => {
        const severity = row.status === "Completed" ? "success" : row.status === "Applied" ? "info" : "warning";
        return <Tag value={row.status} severity={severity} />;
    };

    const actionTemplate = (row: any) => (
        <Button label="View" severity="primary" className="p-button-sm" onClick={() => alert(`Viewing task: ${row.title}`)} />
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
            <DataTable
                value={tasks}
                responsiveLayout="scroll"
                className="shadow-md border border-gray-200"
                rowHover
            >
                <Column field="title" header="Task" headerClassName="bg-gray-100 font-semibold" className="p-2" />
                <Column field="org" header="Organization" headerClassName="bg-gray-100 font-semibold" className="p-2" />
                <Column field="deadline" header="Deadline" headerClassName="bg-gray-100 font-semibold" className="p-2" />
                <Column field="status" header="Status" body={statusTemplate} headerClassName="bg-gray-100 font-semibold" className="p-2" />
                <Column header="Action" body={actionTemplate} headerClassName="bg-gray-100 font-semibold" className="p-2" />
            </DataTable>
        </div>
    );
};

export default VolunteerTasks;
