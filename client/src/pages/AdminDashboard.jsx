import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCourses, deleteCourse } from "../redux/slice/courseSlice";
import { fetchDashboardData } from "../redux/slice/razorpaySlice";
import { getCreatorRequests, handleCreatorRequest } from "../redux/slice/creatorSlice"; // ✅ NEW
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";


function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courseData = [], loading } = useSelector((state) => state.course);
  const { overview, monthlyStats, recentPayments } = useSelector(
    (state) => state.payment
  );
  const { requests = [] } = useSelector((state) => state.creator); // ✅ NEW

  const [search, setSearch] = useState("");

  // =======================
  // INITIAL FETCH + AUTO REFRESH
  // =======================
  useEffect(() => {
    dispatch(getAllCourses());
    dispatch(fetchDashboardData());
    dispatch(getCreatorRequests()); // ✅ NEW

    const interval = setInterval(() => {
      dispatch(fetchDashboardData());
      dispatch(getCreatorRequests()); // ✅ NEW
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // =======================
  // FILTER COURSES
  // =======================
  const filteredCourses = useMemo(() => {
    return courseData?.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [courseData, search]);

  // =======================
  // FORMAT MONTHLY STATS
  // =======================
  const formattedMonthlyStats = useMemo(() => {
    if (!monthlyStats) return [];

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return monthlyStats.map((item) => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue / 100,
      payments: item.payments,
    }));
  }, [monthlyStats]);

  // =======================
  // DELETE COURSE
  // =======================
  const handleDelete = (id) => {
    if (window.confirm("Delete this course?")) {
      dispatch(deleteCourse(id));
    }
  };

  // =======================
  // HANDLE CREATOR REQUEST ✅ NEW
  // =======================
  const handleRequest = (userId, action) => {
    dispatch(handleCreatorRequest({ userId, action }));
  };

  // =======================
  // LOADING STATE
  // =======================
  if (loading && courseData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <input
          placeholder="Search courses..."
          className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card title="Revenue" value={`₹${(overview?.totalRevenue || 0) / 100}`} />
        <Card title="Payments" value={overview?.totalPayments || 0} />
        <Card title="Courses" value={courseData.length} />
        <Card
          title="Avg Revenue"
          value={`₹${Math.round(
            ((overview?.totalRevenue || 0) / 100) /
            (overview?.totalPayments || 1)
          )}`}
        />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <ChartBox title="Monthly Revenue">
          <LineChart data={formattedMonthlyStats}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" />
          </LineChart>
        </ChartBox>

        <ChartBox title="Monthly Payments">
          <BarChart data={formattedMonthlyStats}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="payments" />
          </BarChart>
        </ChartBox>

      </div>

      {/* ✅ CREATOR REQUESTS - NEW SECTION */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold">Creator Requests</h2>
          {requests.length > 0 && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
              {requests.length} pending
            </span>
          )}
        </div>

        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-4 text-sm text-white/50 p-3 border-b border-white/10">
            <span>Name</span>
            <span>Email</span>
            <span>Requested At</span>
            <span>Actions</span>
          </div>

          {requests.length === 0 ? (
            <div className="p-6 text-center text-white/30 text-sm">
              🎉 No pending creator requests
            </div>
          ) : (
            requests.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-4 p-3 text-sm border-b border-white/5 items-center"
              >
                <span className="font-medium">{user.firstname} {user.lastname}</span>
                <span className="text-white/50">{user.email}</span>
                <span className="text-white/40 text-xs">
                  {user.creatorRequest?.requestedAt
                    ? new Date(user.creatorRequest.requestedAt).toLocaleDateString()
                    : "—"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(user._id, "approve")}
                    className="bg-green-500 hover:bg-green-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleRequest(user._id, "reject")}
                    className="bg-red-500 hover:bg-red-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RECENT PAYMENTS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>

        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">

          <div className="grid grid-cols-4 text-sm text-white/50 p-3 border-b border-white/10">
            <span>User</span>
            <span>Email</span>
            <span>Amount</span>
            <span>Date</span>
          </div>

          {recentPayments?.length === 0 ? (
            <p className="p-4 text-white/40">No payments yet</p>
          ) : (
            recentPayments?.map((p) => (
              <div
                key={p._id}
                className="grid grid-cols-4 p-3 text-sm border-b border-white/5"
              >
                <span>
                  {p.user?.firstname} {p.user?.lastname}
                </span>
                <span>{p.user?.email}</span>
                <span className="text-green-400">₹{p.amount / 100}</span>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* COURSES */}
      <h2 className="text-xl font-semibold mb-4">Manage Courses</h2>

      {filteredCourses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/40 transition"
            >
              <img
                src={course?.thumbnail?.secure_url}
                alt={course.title}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-bold text-lg">{course.title}</h3>

                <p className="text-white/40 text-sm line-clamp-2">
                  {course.description}
                </p>

                <div className="text-xs text-white/50 mt-2">
                  👨 {course.createdBy}
                </div>

                <div className="text-yellow-400 text-sm mt-2">
                  🎬 {course.numbersOfLectures || 0} lectures
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/course/${course._id}`, { state: { ...course } })}
                    className="flex-1 bg-blue-500 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 bg-red-500 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

// =======================
// UI COMPONENTS
// =======================
function Card({ title, value }) {
  return (
    <div className="bg-white/5 p-5 rounded-xl border border-white/10">
      <p className="text-white/40 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <h2 className="text-sm text-white/50 mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export default AdminDashboard;