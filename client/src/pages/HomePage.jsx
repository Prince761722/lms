import { Link } from "react-router-dom";
import home from '../assets/images/home.png'
import HomeLayout from "../Layouts/homeLayout";

function HomePage() {
  return (
    <HomeLayout>
      <div className="text-white min-h-[90vh] flex items-center justify-center px-6 sm:px-10 lg:px-16 py-10">

        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 w-full max-w-7xl mx-auto">

          {/* ── CONTENT ── */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Find out best
              <span className="text-yellow-500 font-bold ml-2">
                Online Courses
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
              We have a large library of courses taught by highly skilled
              and qualified faculties at an affordable price.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/courses" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-yellow-500 px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-all duration-300">
                  Explore Courses
                </button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto border border-yellow-500 px-6 py-3 rounded-md font-semibold hover:bg-yellow-600 transition-all duration-300">
                  Contact Us
                </button>
              </Link>
            </div>

          </div>

          {/* ── IMAGE ── */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <img
              src={home}
              alt="homepage image"
              className="w-64 sm:w-80 lg:w-full max-w-md object-contain"
            />
          </div>

        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;