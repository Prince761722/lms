import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCourse, updateCourse } from "../redux/slice/courseSlice";


function EditCourseModal({ course, onClose }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        title: course?.title || "",
        description: course?.description || "",
        category: course?.category || "",
        createdBy: course?.createdBy || "",
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async () => {
        setSaving(true);
        await dispatch(updateCourse({ id: course._id, data: form }));
        setSaving(false);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/60"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white font-bold text-lg tracking-tight">Edit Course</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {[
                        { label: "Title", name: "title", multiline: false },
                        { label: "Category", name: "category", multiline: false },
                        { label: "Instructor", name: "createdBy", multiline: false },
                        { label: "Description", name: "description", multiline: true },
                    ].map(({ label, name, multiline }) => (
                        <div key={name} className="flex flex-col gap-1.5">
                            <label className="text-white/40 text-xs uppercase tracking-widest font-semibold">
                                {label}
                            </label>
                            {multiline ? (
                                <textarea
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    rows={3}
                                    className="bg-white/[0.04] border border-white/10 focus:border-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/10 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 resize-none transition-all duration-200"
                                />
                            ) : (
                                <input
                                    type="text"
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    className="bg-white/[0.04] border border-white/10 focus:border-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/10 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 transition-all duration-200"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 cursor-pointer bg-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}


function DeleteConfirmModal({ course, onClose }) {
    const dispatch = useDispatch();
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        await dispatch(deleteCourse(course._id));
        setDeleting(false);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm bg-[#111118] border border-red-500/20 rounded-2xl p-6 shadow-2xl shadow-black/60"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </div>

                <h2 className="text-white font-bold text-base text-center mb-1">Delete Course?</h2>
                <p className="text-white/40 text-sm text-center mb-6 leading-relaxed">
                    <span className="text-white/70 font-medium">"{course?.title}"</span> will be permanently removed.
                    This action cannot be undone.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 cursor-pointer bg-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 bg-red-500 hover:bg-red-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                    >
                        {deleting ? "Deleting…" : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}


function CourseCard({ data }) {
    const navigate = useNavigate();

    
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    const isAdmin = isLoggedIn && role?.toLowerCase() === "admin";

    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <div className="flex flex-col bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/10 hover:border-yellow-500/30">

                
                <div
                    onClick={() => navigate("/course/description", { state: { ...data } })}
                    className="relative overflow-hidden h-48 flex-shrink-0 cursor-pointer"
                >
                    <img
                        src={data?.thumbnail?.secure_url}
                        alt={data?.title || "course thumbnail"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                        }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 items-center justify-center text-4xl">
                        📚
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-900 to-transparent" />
                    {data?.category && (
                        <span className="absolute top-3 left-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[0.7rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                            {data.category}
                        </span>
                    )}
                </div>

               
                <div
                    onClick={() => navigate("/course/description", { state: { ...data } })}
                    className="flex flex-col flex-1 p-4 gap-2 cursor-pointer"
                >
                    <h2 className="text-white font-bold text-base leading-snug line-clamp-2">
                        {data?.title}
                    </h2>
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-2 font-light">
                        {data?.description}
                    </p>

                    <div className="h-px bg-white/10 my-1" />

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-sm text-white/50">
                            <svg className="text-yellow-400 shrink-0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                            <span>
                                <span className="text-yellow-400 font-semibold">By </span>
                                {data?.createdBy || "Unknown"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                            <svg className="text-yellow-400 shrink-0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                            </svg>
                            <span>
                                <span className="text-yellow-400 font-semibold">Lectures: </span>
                                {data?.numberOfLectures ?? data?.numbersOfLectures ?? "N/A"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto pt-2">
                        <span className="text-yellow-400 text-sm font-semibold flex items-center gap-1">
                            View Course
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>

               
                {isAdmin && (
                    <div className="flex border-t border-white/10">

                        
                        <button
                            onClick={() => setShowEdit(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 text-white/50 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all duration-200 cursor-pointer border-r border-white/10"
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                            </svg>
                            <span className="text-xs font-semibold uppercase tracking-wider">Edit</span>
                        </button>

                        
                        <button
                            onClick={() => setShowDelete(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                            <span className="text-xs font-semibold uppercase tracking-wider">Delete</span>
                        </button>

                    </div>
                )}
            </div>

            {showEdit && <EditCourseModal course={data} onClose={() => setShowEdit(false)} />}
            {showDelete && <DeleteConfirmModal course={data} onClose={() => setShowDelete(false)} />}
        </>
    );
}

export default CourseCard;