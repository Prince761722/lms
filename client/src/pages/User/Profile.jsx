import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeLayout from "../../Layouts/homeLayout";
import { getProfileAction } from "../../redux/slice/authSlice";

function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const data = useSelector((state) => state.auth?.data);

    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        dispatch(getProfileAction());
    }, []);

    return (
        <HomeLayout>
            <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-14">
                <div className="max-w-4xl mx-auto">

                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-10">
                        My{" "}
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                            Profile
                        </span>
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                        {/* LEFT — Avatar + name + role */}
                        <div className="flex flex-col items-center gap-5 bg-white/[0.03] border border-white/10 rounded-2xl p-8">

                            <div className="relative group">
                                {!imgError && data?.avtar?.secure_url ? (
                                    <img
                                        src={data.avtar.secure_url}
                                        alt="profile avatar"
                                        className="w-28 h-28 rounded-full object-cover border-4 border-yellow-500/30 shadow-xl shadow-black/40"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-4 border-yellow-500/30 flex items-center justify-center text-4xl">
                                        🧑
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <h2 className="text-xl font-bold text-white">
                                    {`${data?.firstName || ""} ${data?.lastName || ""}`.trim() || "User"}
                                </h2>
                                <p className="text-white/40 text-sm mt-0.5">
                                    {data?.email || "No email available"}
                                </p>
                            </div>

                            <span
                                className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                                    data?.role === "admin"
                                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                }`}
                            >
                                {data?.role ?? ""}
                            </span>

                            <button
                                onClick={() => {
                                    if (!data) return;
                                    navigate("/user/profile/edit");
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-yellow-500/10 border border-white/10 hover:border-yellow-500/30 text-white/70 hover:text-yellow-400 text-sm font-medium py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                            >
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Edit Profile
                            </button>
                        </div>

                        {/* RIGHT — Details */}
                        <div className="md:col-span-2 flex flex-col gap-5">

                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
                                    Account Information
                                </h3>

                                <div className="flex flex-col divide-y divide-white/[0.06]">
                                    {[
                                        {
                                            icon: (
                                                <svg width="16" height="16" fill="none" stroke="#eab308" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            ),
                                            label: "Full Name",
                                            value: `${data?.firstname || ""} ${data?.lastname || ""}`.trim() || "N/A",
                                        },
                                        {
                                            icon: (
                                                <svg width="16" height="16" fill="none" stroke="#eab308" strokeWidth="2" viewBox="0 0 24 24">
                                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                                </svg>
                                            ),
                                            label: "Email Address",
                                            value: data?.email || "N/A",
                                        },
                                        {
                                            icon: (
                                                <svg width="16" height="16" fill="none" stroke="#eab308" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                </svg>
                                            ),
                                            label: "Role",
                                            value: data?.role || "N/A",
                                        },
                                        {
                                            icon: (
                                                <svg width="16" height="16" fill="none" stroke="#eab308" strokeWidth="2" viewBox="0 0 24 24">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                                    <path d="M16 2v4M8 2v4M3 10h18" />
                                                </svg>
                                            ),
                                            label: "Member Since",
                                            value: data?.createdAt
                                                ? new Date(data.createdAt).toLocaleDateString("en-US", {
                                                      year: "numeric",
                                                      month: "long",
                                                      day: "numeric",
                                                  })
                                                : "N/A",
                                        },
                                        {
                                            icon: (
                                                <svg width="16" height="16" fill="none" stroke="#eab308" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                                                </svg>
                                            ),
                                            label: "Subscription",
                                            value: data?.subscription?.status === "active" ? "✅ Active" : "❌ Inactive",
                                        },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                                                {item.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white/35 text-[0.68rem] uppercase tracking-widest font-medium mb-0.5">
                                                    {item.label}
                                                </p>
                                                <p className="text-white text-sm font-medium truncate">
                                                    {item.value}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={() => {
                                        if (!data) return;
                                        navigate("/user/changepassword");
                                    }}
                                    className="flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-yellow-500/10 border border-white/10 hover:border-yellow-500/30 text-white/70 hover:text-yellow-400 text-sm font-medium py-3 rounded-xl transition-all duration-200 cursor-pointer"
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Change Password
                                </button>

                                <button
                                    onClick={() => navigate("/courses")}
                                    className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bold text-sm py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer"
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                    </svg>
                                    Browse Courses
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Profile;