import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseLectures } from "../../redux/slice/leactureSlice";
import HomeLayout from "../../Layouts/homeLayout";

function WatchLecture() {
  const { courseId, lectureId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lectures, loading } = useSelector((state) => state.lecture);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  //  FETCH LECTURES 
  useEffect(() => {
    if (courseId) {
      dispatch(getCourseLectures(courseId));
    }
  }, [courseId, dispatch]);

  // SET CURRENT LECTURE 
  useEffect(() => {
    if (lectures?.length) {
      const index = lectures.findIndex((l) => l._id === lectureId);
      setCurrentIndex(index !== -1 ? index : 0);
    }
  }, [lectures, lectureId]);

  // RESET PLAY STATE
  useEffect(() => {
    setIsPlaying(false);
  }, [lectureId]);

  const currentLecture = lectures[currentIndex];

  //  NAVIGATION 
  const handleNext = () => {
    if (currentIndex < lectures.length - 1) {
      const next = lectures[currentIndex + 1];
      navigate(`/lecture/watch/${courseId}/${next._id}`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = lectures[currentIndex - 1];
      navigate(`/lecture/watch/${courseId}/${prev._id}`);
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white flex">

        {/*VIDEO SECTION */} 
        <div className="flex-1 p-6">

          {loading ? (
            <p>Loading...</p>
          ) : currentLecture ? (
            <>
              {/* VIDEO PREVIEW / PLAYER */}
              <div className="relative">

                {!isPlaying ? (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="cursor-pointer group"
                  >

                    {/*  AUTO VIDEO PREVIEW */}
                    <video
                      src={currentLecture?.lecture?.secure_url}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full max-h-[70vh] object-cover rounded"
                    />

                    {/* SMALL PLAY BUTTON */}
                    <div className="absolute bottom-4 right-4 opacity-80 group-hover:opacity-100 transition">
                      <div className="bg-black/70 px-4 py-2 rounded-full text-sm">
                        ▶ Play
                      </div>
                    </div>

                  </div>
                ) : (
                  <video
                    key={currentLecture._id}
                    src={currentLecture?.lecture?.secure_url}
                    controls
                    autoPlay
                    className="w-full max-h-[70vh]"
                  />
                )}

              </div>

              {/* ===== INFO ===== */}
              <h2 className="text-2xl font-bold mt-4">
                {currentLecture.title}
              </h2>

              <p className="text-white/50 mt-2">
                {currentLecture.description}
              </p>

              {/* ===== NAV BUTTONS ===== */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="bg-white/10 px-4 py-2 rounded disabled:opacity-30"
                >
                  ⬅ Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === lectures.length - 1}
                  className="bg-yellow-400 text-black px-4 py-2 rounded disabled:opacity-30"
                >
                  Next ➡
                </button>
              </div>

            </>
          ) : (
            <p>No lecture found</p>
          )}

        </div>

        {/* ===== SIDEBAR ===== */}
        <div className="w-[320px] bg-[#111] border-l border-white/10 overflow-y-auto">

          <div className="p-4 font-bold border-b border-white/10">
            Lectures
          </div>

          {lectures?.map((lecture, index) => (
            <div
              key={lecture._id}
              onClick={() =>
                navigate(`/lecture/watch/${courseId}/${lecture._id}`)
              }
              className={`p-4 cursor-pointer border-b border-white/10 transition ${
                index === currentIndex
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-white/10"
              }`}
            >
              <p className="text-sm font-semibold">
                {index + 1}. {lecture.title}
              </p>
            </div>
          ))}

        </div>
      </div>
    </HomeLayout>
  );
}

export default WatchLecture;