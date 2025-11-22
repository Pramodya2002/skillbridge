import React, { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";

type OptionType = { value: string; label: string };

const causeOptions: OptionType[] = [
    { value: "education", label: "Education" },
    { value: "health", label: "Health" },
    { value: "environment", label: "Environment" },
    { value: "animal-welfare", label: "Animal Welfare" },
    { value: "youth", label: "Youth Empowerment" },
    { value: "human-rights", label: "Human Rights" },
    { value: "arts", label: "Arts & Culture" },
    { value: "disaster-relief", label: "Disaster Relief" },
    { value: "technology", label: "Technology for Good" },
    { value: "sports", label: "Sports & Recreation" },
];

type NonprofitData = {
    id?: number;
    name: string;
    email: string;
    org_name?: string;
    mission?: string;
    focus_area?: string;
    website?: string;
    contact_name?: string;
    contact_email?: string;
};

const NonprofitProfile: React.FC = () => {
    const [nonprofit, setNonprofit] = useState<NonprofitData>({
        name: "",
        email: "",
    });
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        fetch("http://localhost:8000/api/profile", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => res.json())
            .then((data) => {
                setNonprofit({ ...data.user, ...data.roleData });
            })
            .catch((err) => console.error("Error fetching nonprofit profile:", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setNonprofit((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: nonprofit.name,
            email: nonprofit.email,
            org_name: nonprofit.org_name,
            mission: nonprofit.mission,
            focus_area: nonprofit.focus_area,
            website: nonprofit.website,
            contact_name: nonprofit.contact_name,
            contact_email: nonprofit.contact_email
        };

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("http://localhost:8000/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.current?.show({
                    severity: "success",
                    summary: "Profile Updated",
                    detail: "Your profile has been successfully updated!",
                    life: 5000,
                    closable: true,
                    style: {
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        backgroundColor: '#10B981',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    },
                    icon: 'pi pi-check-circle'
                });
            } else {
                const errText = await res.text();
                alert("Error: " + errText);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center py-10">
            <Toast ref={toast} position="top-right" />
            <Card className="shadow-2xl rounded-2xl bg-white p-10 max-w-3xl w-full">
                <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">My Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input id="name" value={nonprofit.name} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border rounded" />
                    <input id="email" value={nonprofit.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded" />
                    <input id="org_name" value={nonprofit.org_name} onChange={handleChange} placeholder="Organization Name" className="w-full p-3 border rounded" />
                    <textarea id="mission" value={nonprofit.mission} onChange={handleChange} placeholder="Mission" className="w-full p-3 border rounded" />
                    <select
                        id="focus_area"
                        value={nonprofit.focus_area || ""}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                    >
                        <option value="">Select Focus Area</option>
                        {causeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <input id="website" value={nonprofit.website} onChange={handleChange} placeholder="Website" className="w-full p-3 border rounded" />
                    <input id="contact_name" value={nonprofit.contact_name} onChange={handleChange} placeholder="Contact Name" className="w-full p-3 border rounded" />
                    <input id="contact_email" value={nonprofit.contact_email} onChange={handleChange} placeholder="Contact Email" className="w-full p-3 border rounded" />
                    <button type="submit" className="mt-4 w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700">Save Profile</button>
                </form>
            </Card>
        </div>
    );
};

export default NonprofitProfile;
