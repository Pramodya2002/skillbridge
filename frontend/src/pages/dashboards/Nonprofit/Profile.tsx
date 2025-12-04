import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import Select from "react-select";

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
        org_name: "",
        mission: "",
        focus_area: "",
        website: "",
        contact_name: "",
        contact_email: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        fetch("http://localhost:8000/api/profile", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => res.json())
            .then((data) => {
                const profile = { ...data.user, ...data.roleData };
                setNonprofit(profile);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching profile:", err);
                setIsLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setNonprofit((prev) => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (selected: OptionType | null) => {
        setNonprofit((prev) => ({ ...prev, focus_area: selected?.value || "" }));
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
            contact_email: nonprofit.contact_email,
        };

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("http://localhost:8000/api/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.current?.show({
                    severity: "success",
                    summary: "Profile Saved!",
                    detail: "Your organization profile has been updated successfully.",
                    life: 6000,
                    className: "w-full max-w-md shadow-2xl",
                    pt: {
                        root: { className: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl overflow-hidden border-0" },
                        icon: { className: "hidden" },
                        summary: { className: "font-black text-2xl" },
                        detail: { className: "text-white/90 mt-2 text-lg" },
                        closeButton: { className: "text-white/70 hover:text-white hover:bg-white/20 rounded-full w-12 h-12" },
                    },
                    icon: () => (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 rounded-full mr-6 shadow-2xl">
                            <i className="pi pi-sparkles text-5xl text-white"></i>
                        </div>
                    ),
                });
            } else {
                throw new Error("Update failed");
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Update Failed",
                detail: "There was a problem saving your profile. Please try again.",
                life: 5000,
            });
        }
    };

    const customSelectStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(16px)",
            border: "2px solid rgba(20, 184, 166, 0.4)",
            borderRadius: "1.5rem",
            padding: "1rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            fontSize: "1.1rem",
            "&:hover": { borderColor: "#14b8a6" },
        }),
        placeholder: (base: any) => ({
            ...base,
            color: "#6b7280",
            fontWeight: "medium",
        }),
        singleValue: (base: any) => ({
            ...base,
            color: "#115e59",
            fontWeight: "bold",
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "1.5rem",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "linear-gradient(to right, #14b8a6, #10b981)"
                : state.isFocused
                    ? "rgba(20, 184, 166, 0.1)"
                    : "transparent",
            color: state.isSelected ? "white" : "#1f2937",
            fontWeight: state.isSelected ? "bold" : "medium",
            padding: "1rem 1.5rem",
        }),
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-8xl text-teal-600 mb-8"></i>
                    <p className="text-3xl font-bold text-gray-700">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-16 px-6 relative overflow-hidden">
            <Toast ref={toast} position="top-right" />

            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-20 left-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse"></div>
                <div className="absolute bottom-32 right-32 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Hero Header */}
                <div className="text-center mb-16">
                    <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 leading-tight">
                        Your Organization Profile
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-700 mt-6 font-medium max-w-4xl mx-auto">
                        This is how volunteers see your mission. Make it inspiring.
                    </p>
                </div>

                {/* Main Profile Card */}
                <div className="bg-white/80 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/60 p-10 md:p-16 overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="relative">
                                <input
                                    id="name"
                                    value={nonprofit.name}
                                    onChange={handleChange}
                                    className="peer w-full px-8 py-7 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all duration-300 text-xl shadow-inner"
                                    placeholder=" "
                                    required
                                />
                                <label className="absolute left-8 -top-5 px-4 bg-white text-xl font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-5 peer-focus:text-teal-700 peer-placeholder-shown:top-7 peer-placeholder-shown:text-gray-500">
                                    Admin Full Name *
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={nonprofit.email}
                                    onChange={handleChange}
                                    className="peer w-full px-8 py-7 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/40 focus:border-teal-600 transition-all duration-300 text-xl shadow-inner"
                                    placeholder=" "
                                    required
                                />
                                <label className="absolute left-8 -top-5 px-4 bg-white text-xl font-bold text-teal-700 pointer-events-none transition-all duration-300 peer-focus:-top-5 peer-focus:text-teal-700 peer-placeholder-shown:top-7 peer-placeholder-shown:text-gray-500">
                                    Email Address *
                                </label>
                            </div>
                        </div>

                        {/* Organization Info */}
                        <div className="space-y-10">
                            <div className="relative">
                                <input
                                    id="org_name"
                                    value={nonprofit.org_name || ""}
                                    onChange={handleChange}
                                    className="peer w-full px-8 py-7 bg-gradient-to-r from-teal-50 to-emerald-50 backdrop-blur-xl border-2 border-teal-300 rounded-2xl text-teal-900 font-bold placeholder-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-600 transition-all duration-300 text-2xl shadow-inner"
                                    placeholder=" "
                                />
                                <label className="absolute left-8 -top-5 px-4 bg-white text-xl font-black text-teal-800 pointer-events-none transition-all duration-300 peer-focus:-top-5 peer-focus:text-teal-800 peer-placeholder-shown:top-7 peer-placeholder-shown:text-teal-60" >
                                    Organization Name
                                </label>
                            </div>

                            <div className="relative">
                                <textarea
                                    id="mission"
                                    value={nonprofit.mission || ""}
                                    onChange={handleChange}
                                    rows={5}
                                    className="peer w-full px-8 py-7 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 focus:border-emerald-600 transition-all duration-300 text-lg shadow-inner resize-none"
                                    placeholder=" "
                                />
                                <label className="absolute left-8 -top-5 px-4 bg-white text-xl font-bold text-emerald-700 pointer-events-none transition-all duration-300 peer-focus:-top-5 peer-focus:text-emerald-700 peer-placeholder-shown:top-7 peer-placeholder-shown:text-gray-500">
                                    Mission Statement
                                </label>
                            </div>

                            <div>
                                <label className="block text-2xl font-black text-teal-800 mb-6">Primary Focus Area</label>
                                <Select
                                    options={causeOptions}
                                    value={causeOptions.find(opt => opt.value === nonprofit.focus_area) || null}
                                    onChange={handleSelectChange}
                                    placeholder="Choose your cause..."
                                    styles={customSelectStyles}
                                    className="text-lg"
                                />
                            </div>
                        </div>

                        {/* Contact & Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="relative">
                                <input
                                    id="website"
                                    value={nonprofit.website || ""}
                                    onChange={handleChange}
                                    className="peer w-full px-8 py-7 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/40 focus:border-cyan-600 transition-all duration-300 text-xl shadow-inner"
                                    placeholder=" "
                                />
                                <label className="absolute left-8 -top-5 px-4 bg-white text-xl font-bold text-cyan-700 pointer-events-none transition-all duration-300 peer-focus:-top-5 peer-focus:text-cyan-700 peer-placeholder-shown:top-7 peer-placeholder-shown:text-gray-500">
                                    Website URL
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    id="contact_name"
                                    value={nonprofit.contact_name || ""}
                                    onChange={handleChange}
                                    className="peer w-full px-8 py-7 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/40 focus:border-purple-600 transition-all duration-300 text-xl shadow-inner"
                                    placeholder=" "
                                    required
                                />
                                <label className="absolute left-8 -top-5 px-4 bg-white text-xl font-bold text-purple-700 pointer-events-none transition-all duration-300 peer-focus:-top-5 peer-focus:text-purple-700 peer-placeholder-shown:top-7 peer-placeholder-shown:text-gray-500">
                                    Contact Person Name *
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    id="contact_email"
                                    type="email"
                                    value={nonprofit.contact_email || ""}
                                    onChange={handleChange}
                                    className="peer w-full px-8 py-7 bg-white/90 backdrop-blur-xl border-2 border-gray-300/70 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/40 focus:border-purple-600 transition-all duration-300 text-xl shadow-inner"
                                    placeholder=" "
                                />
                                <label className="absolute left-8 -top-5 px-4 bg-white text-xl font-bold text-purple-700 pointer-events-none transition-all duration-300 peer-focus:-top-5 peer-focus:text-purple-700 peer-placeholder-shown:top-7 peer-placeholder-shown:text-gray-500">
                                    Public Contact Email
                                </label>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-center pt-10">
                            <button
                                type="submit"
                                className="group relative px-24 py-8 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-4xl rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-4 transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-6">
                                    <i className="pi pi-save text-5xl"></i>
                                    Save Profile
                                </span>
                                <div className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full"></div>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="text-center mt-20">
                    <p className="text-4xl font-bold text-teal-800">
                        Your story inspires action.
                    </p>
                    <p className="text-2xl text-gray-600 mt-4">
                        Every detail here helps volunteers choose to join your mission.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NonprofitProfile;