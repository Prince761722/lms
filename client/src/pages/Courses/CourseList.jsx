import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CourseCard from "../../components/CourseCard";
import HomeLayout from "../../Layouts/homeLayout";
import { getAllCourses } from "../../redux/slice/courseSlice";

function CourseList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseData, loading } = useSelector((state) => state.course);
    const [searchQuery, setSearchQuery] = useState("");

  
    const role = useSelector((state) => state.auth?.data?.role);
    const isAdmin = role === "admin";

    useEffect(() => {
        async function loadCourses() {
            await dispatch(getAllCourses());
        }
        loadCourses();
    }, [dispatch]);

    const filteredCourses = courseData?.filter((course) =>
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <HomeLayout>
            <div className="min-h-screen bg-[#0a0a0f] text-white px-4 sm:px-8 py-14">
                <div className="max-w-7xl mx-auto">

                   
                    <span className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[0.7rem] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                        {loading ? "Loading..." : `${filteredCourses?.length ?? 0} Courses`}
                    </span>

                    <h1 className="mt-4 mb-2 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                        Explore courses made by{" "}
                        <span className="bg-linear-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                            Industry Experts
                        </span>
                    </h1>

                    
                    <p className="text-white/45 text-sm sm:text-base font-light max-w-lg mb-8">
                        Level up your skills with expert-curated content built for real-world results.
                    </p>

                   
                    <div className="h-px bg-linear-to-r from-yellow-500/40 via-yellow-500/10 to-transparent mb-8" />

                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">

                        
                        <div className="relative flex-1">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                                width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search courses or categories…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/10 focus:border-yellow-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-yellow-500/10 text-white placeholder-white/30 text-sm rounded-xl pl-11 pr-4 py-3 transition-all duration-200"
                            />
                        </div>

                        
                        {isAdmin && (
                            <button
                                onClick={() => navigate("/course/create")}
                                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/25 cursor-pointer whitespace-nowrap"
                            >
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Create Course
                            </button>
                        )}
                    </div>

                   
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white/4 border border-white/[0.07] rounded-2xl h-72 overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/[0.05] to-transparent animate-pulse" />
                                </div>
                            ))
                        ) : filteredCourses?.length > 0 ? (
                            filteredCourses.map((element) => (
                                <CourseCard key={element._id} data={element} />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center gap-4 py-24 text-center">
                                <div className="w-16 h-16 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-center text-3xl">
                                    📭
                                </div>
                                <p className="text-white/50 text-base">
                                    {searchQuery
                                        ? `No courses found for "${searchQuery}"`
                                        : "No courses available yet."}
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="border border-yellow-500/30 hover:border-yellow-500/60 text-yellow-400 text-sm px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer bg-transparent"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </HomeLayout>
    );
}

export default CourseList;