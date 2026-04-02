import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { requestCreatorAccess } from "../../redux/slice/creatorSlice";

function CourseDescription() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const course = location.state;
 

  // ✅ AUTH DATA
  const { isLoggedIn, role, data } = useSelector((state) => state.auth);
  const userId = data?._id || data?.id;
  const isCourseOwner = isLoggedIn && course?.createdBy === userId;

  const userRole = role?.toLowerCase();

  const isAdmin = isLoggedIn && userRole === "admin";
  const isCreator = isLoggedIn && userRole === "creator";

  // ✅ SUBSCRIPTION CHECK (FIXED)
  const isSubscribed = data?.subscription?.status === "active";

  // ✅ CREATOR REQUEST STATUS
  const isRequestPending = data?.creatorRequest?.status === "pending";

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4 text-white">
        <div className="text-5xl">📭</div>
        <p className="text-white/50 text-base">No course data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const createdDate = course?.createdAt
    ? new Date(course.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const metaItems = [
    { label: "Category", value: course?.category || "N/A" },
    { label: "Instructor", value: course?.createdBy || "Unknown" },
    {
      label: "Total Lectures",
      value: course?.numbersOfLectures ?? "N/A",
    },
    { label: "Created On", value: createdDate },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-[1100px] mx-auto px-6 py-10">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mb-10 bg-white/5 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-12">

          {/* IMAGE */}
          <div className="rounded-xl overflow-hidden border border-white/10">
            <img
              src={course?.thumbnail?.secure_url}
              alt={course.title}
              className="w-full h-[320px] object-cover"
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">{course.title}</h1>

            <p className="text-white/50">{course.description}</p>

            <div className="grid sm:grid-cols-2 gap-3">
              {metaItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 p-4 rounded-xl"
                >
                  <p className="text-xs text-white/40">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            {/* ENROLL */}
            <button
              onClick={() =>
                navigate("/payment/checkout", { state: course })
              }
              className="bg-yellow-500 text-black py-3 rounded-xl font-bold"
            >
              Enroll Now
            </button>
          </div>
        </div>

        {/* ===== LECTURES & ROLE ACTIONS ===== */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">Course Actions</h2>

          <div className="grid md:grid-cols-2 gap-4">

            {/* 🎥 VIEW / LOCK */}
            {isAdmin || isSubscribed || isCourseOwner? (
              <button
                onClick={() => navigate(`/lecture/${course._id}`)}
               
                className="bg-blue-500 hover:bg-blue-400 py-4 rounded-xl font-bold"
              >
                📺 View Lectures
              </button>
            ) : (
              <button
                onClick={() => navigate("/payment/checkout")}
                className="bg-gray-600 hover:bg-gray-500 py-4 rounded-xl font-bold"
              >
                🔒 Subscribe to Unlock
              </button>
            )}

            {/* 👤 NORMAL USER → BECOME CREATOR */}
            {userRole === "user" && !isRequestPending && (
              <button
                onClick={() => dispatch(requestCreatorAccess())}
                className="bg-purple-500 hover:bg-purple-400 py-4 rounded-xl font-bold"
              >
                🚀 Become Creator
              </button>
            )}

            {/* ⏳ REQUEST PENDING */}
            {userRole === "user" && isRequestPending && (
              <button
                disabled
                className="bg-gray-500 py-4 rounded-xl font-bold cursor-not-allowed"
              >
                ⏳ Request Pending
              </button>
            )}

            {/* 👨‍💼 CREATOR + ADMIN → ADD COURSE */}
            {(isAdmin || isCourseOwner) && (
              <button
                onClick={() => navigate("/lecture/add/:courseId")}
                className="bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl font-bold"
              >
                ➕ add leactures
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDescription;