import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface ProfileData {
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    roleData: {
        company_name?: string;
        department?: string;
        position?: string;
        company_website?: string;
        employee_count?: number;
    };
}

const HrProfile: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Mock impact stats (replace with real API later)
    const stats = {
        employeesLinked: 45,
        totalVolunteeringHours: 1280,
        activeVolunteers: 18,
        completedTasks: 67,
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await fetch("http://localhost:8000/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();

                setProfile(data);
                setFormData({
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone || "",
                    company_name: data.roleData.company_name || "",
                    department: data.roleData.department || "",
                    position: data.roleData.position || "",
                    company_website: data.roleData.company_website || "",
                    employee_count: data.roleData.employee_count || 0,
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
                toast.current?.show({
                    severity: "error",
                    summary: "Failed to load profile",
                    detail: "Please try again later.",
                    life: 5000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("http://localhost:8000/api/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Update failed");
            }

            const updated = await res.json();
            setProfile(updated);
            setIsEditing(false);

            toast.current?.show({
                severity: "success",
                summary: "Profile Updated",
                detail: "Your profile has been successfully updated.",
                life: 4000,
            });
        } catch (err: any) {
            toast.current?.show({
                severity: "error",
                summary: "Update Failed",
                detail: err.message || "Could not update profile.",
                life: 5000,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.user.name,
                email: profile.user.email,
                phone: profile.user.phone || "",
                company_name: profile.roleData.company_name || "",
                department: profile.roleData.department || "",
                position: profile.roleData.position || "",
                company_website: profile.roleData.company_website || "",
                employee_count: profile.roleData.employee_count || 0,
            });
        }
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <i className="pi pi-spin pi-spinner text-6xl text-teal-600"></i>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-20 text-gray-600">
                <i className="pi pi-exclamation-triangle text-6xl mb-4"></i>
                <p className="text-xl">Unable to load profile data.</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {/* Page Header */}
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-3">
                    HR Manager Profile
                </h1>
                <p className="text-xl text-gray-700">
                    Manage your account details and view your CSR impact overview
                </p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card – Left Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
                            <div className="relative">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl ring-8 ring-white/50">
                                    {profile.user.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                    <i className="pi pi-pencil text-lg"></i>
                                </div>
                            </div>

                            <div className="text-center sm:text-left">
                                <h2 className="text-3xl sm:text-4xl font-black text-teal-800">{profile.user.name}</h2>
                                <p className="text-lg text-teal-600 font-medium">{profile.roleData.position || "HR Manager"}</p>
                                <p className="text-gray-600 mt-1">{profile.roleData.company_name || "Company Name"}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Email: {profile.user.email}
                                </p>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="relative">
                                    <InputText
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-base sm:text-lg shadow-inner"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500"
                                    >
                                        Full Name
                                    </label>
                                </div>

                                <div className="relative">
                                    <InputText
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="peer w-full px-6 py-5 bg-gray-100/80 backdrop-blur-xl border-2 border-gray-300/50 rounded-2xl text-gray-700 font-medium cursor-not-allowed text-base sm:text-lg shadow-inner"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-gray-500 pointer-events-none"
                                    >
                                        Email (cannot be changed)
                                    </label>
                                </div>

                                <div className="relative">
                                    <InputText
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-base sm:text-lg shadow-inner"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="phone"
                                        className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500"
                                    >
                                        Phone Number
                                    </label>
                                </div>

                                <div className="relative">
                                    <InputText
                                        id="company_name"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-base sm:text-lg shadow-inner"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="company_name"
                                        className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500"
                                    >
                                        Company Name
                                    </label>
                                </div>

                                <div className="relative">
                                    <InputText
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-base sm:text-lg shadow-inner"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="department"
                                        className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500"
                                    >
                                        Department
                                    </label>
                                </div>

                                <div className="relative">
                                    <InputText
                                        id="position"
                                        name="position"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        disabled={!isEditing}
                                        className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-base sm:text-lg shadow-inner"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="position"
                                        className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500"
                                    >
                                        Position
                                    </label>
                                </div>

                                <div className="relative">
                                    <InputText
                                        id="company_website"
                                        name="company_website"
                                        value={formData.company_website}
                                        onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                                        disabled={!isEditing}
                                        className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-base sm:text-lg shadow-inner"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="company_website"
                                        className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500"
                                    >
                                        Company Website
                                    </label>
                                </div>

                                <div className="relative">
                                    <InputText
                                        id="employee_count"
                                        name="employee_count"
                                        type="number"
                                        value={formData.employee_count}
                                        onChange={(e) => setFormData({ ...formData, employee_count: Number(e.target.value) || 0 })}
                                        disabled={!isEditing}
                                        className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-base sm:text-lg shadow-inner"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="employee_count"
                                        className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500"
                                    >
                                        Employee Count
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-10">
                                {isEditing ? (
                                    <>
                                        <Button
                                            label="Cancel"
                                            icon="pi pi-times"
                                            onClick={handleCancel}
                                            className="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-2xl hover:bg-gray-300 transition-all"
                                            disabled={saving}
                                        />
                                        <Button
                                            label="Save Changes"
                                            icon="pi pi-check"
                                            loading={saving}
                                            onClick={handleSave}
                                            className="px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                        />
                                    </>
                                ) : (
                                    <Button
                                        label="Edit Profile"
                                        icon="pi pi-pencil"
                                        onClick={() => setIsEditing(true)}
                                        className="px-10 py-4 bg-teal-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column – Stats & Quick Info */}
                <div className="space-y-8">
                    {/* Impact Stats Card */}
                    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
                        <h3 className="text-2xl font-black text-teal-800 mb-6">Your Impact at a Glance</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-5xl font-black text-emerald-600">{stats.employeesLinked}</p>
                                <p className="text-lg text-gray-700 font-medium">Employees Linked</p>
                            </div>
                            <div>
                                <p className="text-5xl font-black text-teal-600">{stats.totalVolunteeringHours}</p>
                                <p className="text-lg text-gray-700 font-medium">Total Volunteering Hours</p>
                            </div>
                            <div>
                                <p className="text-5xl font-black text-purple-600">{stats.activeVolunteers}</p>
                                <p className="text-lg text-gray-700 font-medium">Active Volunteers</p>
                            </div>
                            <div>
                                <p className="text-5xl font-black text-amber-600">{stats.completedTasks}</p>
                                <p className="text-lg text-gray-700 font-medium">Tasks Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Card (Placeholder) */}
                    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8">
                        <h3 className="text-2xl font-black text-teal-800 mb-6">Change Password</h3>
                        <div className="space-y-6">
                            <div className="relative">
                                <InputText
                                    id="currentPassword"
                                    type="password"
                                    className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-base shadow-inner"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="currentPassword"
                                    className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500"
                                >
                                    Current Password
                                </label>
                            </div>

                            <div className="relative">
                                <InputText
                                    id="newPassword"
                                    type="password"
                                    className="peer w-full px-6 py-5 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all text-base shadow-inner"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="newPassword"
                                    className="absolute left-6 -top-3 px-3 bg-white text-sm font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-teal-700 peer-focus:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500"
                                >
                                    New Password
                                </label>
                            </div>

                            <Button
                                label="Update Password"
                                icon="pi pi-lock"
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HrProfile;