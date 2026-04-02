import about from '../assets/images/about.png'
import HomeLayout from "../Layouts/homeLayout";

function AboutUs() {
    return (
        <HomeLayout>
            <div className="text-white min-h-[90vh] flex items-center justify-center px-6 sm:px-10 lg:px-20 py-14">

                <div className="flex flex-col-reverse lg:flex-row items-center gap-10 w-full max-w-7xl mx-auto">

                    {/* ── CONTENT ── */}
                    <section className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-500 leading-tight">
                            Affordable and quality education
                        </h1>

                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Our goal is to provide affordable and quality education to the world.
                            We are a modern Learning Management System designed to deliver high-quality
                            courses with a seamless user experience. Our platform empowers learners
                            with structured content, real-time progress tracking, and secure access.
                            Built with scalable technology, we aim to make online learning efficient,
                            accessible, and engaging for everyone.
                        </p>

                        {/* ── STATS ── */}
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            {[
                                { value: "100+", label: "Courses" },
                                { value: "50+", label: "Instructors" },
                                { value: "10K+", label: "Students" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                                >
                                    <p className="text-yellow-400 text-xl sm:text-2xl font-bold">{stat.value}</p>
                                    <p className="text-white/50 text-xs sm:text-sm mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                    </section>

                    {/* ── IMAGE ── */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center">
                        <img
                            src={about}
                            alt="about us"
                            className="w-64 sm:w-80 lg:w-full max-w-md object-contain drop-shadow-2xl"
                        />
                    </div>

                </div>
            </div>
        </HomeLayout>
    );
}

export default AboutUs;