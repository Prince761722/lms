import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseLectures } from "../../redux/slice/leactureSlice";
import HomeLayout from "../../Layouts/homeLayout";
import LectureCard from "../../components/LectureCard";

function DisplayLectures() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const { lectures, loading } = useSelector((state) => state.lecture);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (courseId) {
      dispatch(getCourseLectures(courseId));
    }
  }, [courseId]);

  const filteredLectures = lectures?.filter((lec) =>
    lec?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-10">

        <div className="max-w-6xl mx-auto">

          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Course Lectures</h1>

            <button
              onClick={() => navigate(`/lecture/add/${courseId}`)}
              className="bg-yellow-400 text-black px-4 py-2 rounded"
            >
              + Add Lecture
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search lecture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-6 bg-black border border-white/10 px-4 py-2 rounded"
          />

          {/* GRID */}
          {loading ? (
            <p>Loading...</p>
          ) : filteredLectures?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {filteredLectures.map((lecture, index) => (
                <LectureCard
                  key={lecture._id}
                  lecture={lecture}
                  index={index}
                  onPlay={() =>
                    navigate(`/lecture/watch/${courseId}/${lecture._id}`)
                  }
                />
              ))}

            </div>
          ) : (
            <p>No lectures found</p>
          )}

        </div>
      </div>
    </HomeLayout>
  );
}

export default DisplayLectures;