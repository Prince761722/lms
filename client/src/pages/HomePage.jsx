import { Link } from "react-router-dom";

import home from '../assets/images/home.png'
import HomeLayout from "../Layouts/homeLayout";

function HomePage() {
return ( <HomeLayout> <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]">


            {/* Content Section */}
            <div className="w-full lg:w-1/2 space-y-6">
                
                <h1 className="text-5xl font-semibold">
                    Find out best
                    <span className="text-yellow-500 font-bold ml-3">
                        Online Courses
                    </span>
                </h1>

                <p className="text-xl text-gray-200">
                    We have a large library of courses taught by highly skilled
                    and qualified faculties at an affordable price.
                </p>

                {/* Button */}
                <div className="">
                    <Link to="/courses">
                        <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-all duration-300">
                            Explore Courses
                        </button>
                    </Link>
                    <Link to="/contact">
                        <button className="border border-yellow-500 px-5 py-3 ml-6 rounded-md font-semibold hover:bg-yellow-600 transition-all duration-300">
                            Contact Us
                        </button>
                    </Link>
                </div>

            </div>

            <div className="w-1/2 flex items-center justify-center">
            <img src={home} alt="homepage image " />

            </div>

        </div>
    </HomeLayout>
);

}

export default HomePage;
