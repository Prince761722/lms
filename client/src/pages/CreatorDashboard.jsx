import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCourses, deleteCourse, updateCourse } from "../redux/slice/courseSlice";
import HomeLayout from "../Layouts/homeLayout";

//  EDIT MODAL 
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
        className="relative w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Edit Course</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            ✕
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
                  className="bg-white/[0.04] border border-white/10 focus:border-yellow-500/50 focus:outline-none text-white text-sm rounded-xl px-4 py-3 resize-none"
                />
              ) : (
                <input
                  type="text"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="bg-white/[0.04] border border-white/10 focus:border-yellow-500/50 focus:outline-none text-white text-sm rounded-xl px-4 py-3"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-white/10 text-white/50 hover:text-white text-sm font-semibold py-2.5 rounded-xl transition-all cursor-pointer bg-transparent"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

//  DELETE MODAL 
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
        className="relative w-full max-w-sm bg-[#111118] border border-red-500/20 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">
          🗑️
        </div>
        <h2 className="text-white font-bold text-base text-center mb-1">Delete Course?</h2>
        <p className="text-white/40 text-sm text-center mb-6">
          <span className="text-white/70 font-medium">"{course?.title}"</span> will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-white/10 text-white/50 hover:text-white text-sm font-semibold py-2.5 rounded-xl cursor-pointer bg-transparent"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold text-sm py-2.5 rounded-xl cursor-pointer"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// STAT CARD
function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-2">
      <div className="text-2xl">{icon}</div>
      <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
      {sub && <p className="text-white/30 text-xs">{sub}</p>}
    </div>
  );
}

// ─── MAIN DASHBOARD
function CreatorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courseData = [], loading } = useSelector((state) => state.course);
  const { data: authData } = useSelector((state) => state.auth);

  const creatorName = authData?.fullName || authData?.name || authData?.firstName || "Creator";
  const creatorId   = authData?._id || authData?.id;

  const [search, setSearch] = useState("");
  const [editCourse, setEditCourse] = useState(null);
  const [deleteCourseData, setDeleteCourseData] = useState(null);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  // ── Only courses created by this creator ──
 const myCourses = courseData.filter(
  (c) => c.createdBy === creatorId || c.createdBy?._id === creatorId
);
  const filtered = myCourses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalLectures = myCourses.reduce(
    (acc, c) => acc + (c.numbersOfLectures || 0), 0
  );

  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#0a0a0f] text-white px-4 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-white/40 text-sm mb-1">Welcome back 👋</p>
              <h1 className="text-3xl font-extrabold">{creatorName}'s Dashboard</h1>
            </div>

            <button
              onClick={() => navigate("/course/create")}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap"
            >
              ➕ Create New Course
            </button>
          </div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            <StatCard
              icon="📚"
              label="Total Courses"
              value={myCourses.length}
              sub="Courses you created"
            />
            <StatCard
              icon="🎬"
              label="Total Lectures"
              value={totalLectures}
              sub="Across all courses"
            />
            <StatCard
              icon="📅"
              label="Latest Course"
              value={myCourses[0]?.title?.slice(0, 16) + (myCourses[0]?.title?.length > 16 ? "…" : "") || "—"}
              sub={myCourses[0] ? new Date(myCourses[0].createdAt).toLocaleDateString() : "No courses yet"}
            />
          </div>

          <div className="h-px bg-white/5 mb-8" />

          {/* ── SEARCH ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search your courses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-yellow-500/50 focus:outline-none text-white placeholder-white/30 text-sm rounded-xl pl-10 pr-4 py-3"
              />
            </div>
          </div>

          {/* ── COURSES ── */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="text-5xl">📭</div>
              <p className="text-white/40">
                {search ? `No courses found for "${search}"` : "You haven't created any courses yet."}
              </p>
              {!search && (
                <button
                  onClick={() => navigate("/course/create")}
                  className="bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm"
                >
                  Create Your First Course
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((course) => (
                <div
                  key={course._id}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300 flex flex-col"
                >
                  {/* thumbnail */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course?.thumbnail?.secure_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {course.category && (
                      <span className="absolute top-3 left-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {course.category}
                      </span>
                    )}
                  </div>

                  {/* info */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-base line-clamp-1">{course.title}</h3>
                    <p className="text-white/40 text-sm line-clamp-2">{course.description}</p>

                    <div className="flex items-center gap-4 text-xs text-white/40 mt-1">
                      <span>🎬 {course.numbersOfLectures || 0} lectures</span>
                      <span>📅 {new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="grid grid-cols-3 border-t border-white/10">
                    <button
                      onClick={() => navigate(`/course/${course._id}`, { state: { ...course } })}
                      className="flex items-center justify-center gap-1.5 py-3 text-white/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all text-xs font-semibold border-r border-white/10 cursor-pointer"
                    >
                      👁 View
                    </button>

                    <button
                      onClick={() => setEditCourse(course)}
                      className="flex items-center justify-center gap-1.5 py-3 text-white/50 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all text-xs font-semibold border-r border-white/10 cursor-pointer"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => setDeleteCourseData(course)}
                      className="flex items-center justify-center gap-1.5 py-3 text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-semibold cursor-pointer"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {editCourse && (
        <EditCourseModal course={editCourse} onClose={() => setEditCourse(null)} />
      )}
      {deleteCourseData && (
        <DeleteConfirmModal course={deleteCourseData} onClose={() => setDeleteCourseData(null)} />
      )}
    </HomeLayout>
  );
}

export default CreatorDashboard;