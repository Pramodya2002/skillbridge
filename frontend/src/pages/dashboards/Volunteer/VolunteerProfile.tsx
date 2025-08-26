import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const VolunteerProfile: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div className="p-6">
            <Card className="shadow-lg rounded-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">My Profile</h2>
                <p className="mb-2"><strong>Name:</strong> {user.name || "Volunteer"}</p>
                <p className="mb-2"><strong>Email:</strong> {user.email || "volunteer@example.com"}</p>
                <p className="mb-4"><strong>Skills:</strong> Communication, Leadership, Teamwork</p>
                <Button
                    label="Edit Profile"
                    icon="pi pi-user-edit"
                    className="p-button-primary p-button-sm"
                    onClick={() => alert("Edit profile clicked")}
                />
            </Card>
        </div>
    );
};

export default VolunteerProfile;
