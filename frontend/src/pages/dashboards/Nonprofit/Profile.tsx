import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const NonprofitProfile: React.FC = () => {
    const nonprofit = JSON.parse(localStorage.getItem("nonprofit") || "{}");

    return (
        <div className="p-6 flex justify-center">
            <Card className="shadow-xl rounded-2xl p-8 border border-gray-200 w-full max-w-2xl bg-white">
                <h2 className="text-3xl font-bold mb-6 text-teal-700 text-center">My Nonprofit Profile</h2>

                <div className="space-y-4">
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                        <p className="mb-1 text-gray-700"><strong>Organization Name:</strong> {nonprofit.org_name || "Organization Name"}</p>
                        <p className="mb-1 text-gray-700"><strong>Mission:</strong> {nonprofit.mission || "Mission statement"}</p>
                        <p className="mb-1 text-gray-700"><strong>Focus Area:</strong> {nonprofit.focus_area || "Focus area"}</p>
                        <p className="mb-1 text-gray-700"><strong>Website:</strong> {nonprofit.website || "Website URL"}</p>
                        <p className="mb-1 text-gray-700"><strong>Contact Name:</strong> {nonprofit.contact_name || "Contact Name"}</p>
                        <p className="mb-0 text-gray-700"><strong>Contact Email:</strong> {nonprofit.contact_email || "Contact Email"}</p>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            label="Edit Profile"
                            icon="pi pi-user-edit"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-200"
                            onClick={() => alert("Edit profile clicked")}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default NonprofitProfile;
