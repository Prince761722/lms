import { Link } from "react-router-dom";

function Denied() {
    return (
        <div className="min-h-screen bg-[#0F1724] flex items-center justify-center px-4">
            <div className="flex flex-col items-center gap-6 text-center">

                {/* Error Code */}
                <h1 className="text-9xl font-bold text-yellow-500">
                    403
                </h1>

                {/* Icon */}
                <div className="text-8xl">
                    🚫
                </div>

                {/* Message */}
                <h2 className="text-3xl font-semibold text-white">
                    Access Denied
                </h2>

                <p className="text-gray-400 max-w-md text-sm">
                    You don't have permission to access this page.
                    Please contact the administrator if you think this is a mistake.
                </p>

                {/* Buttons */}
                <div className="flex gap-4 mt-2">
                    <Link
                        to="/"
                        className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                        Go Home
                    </Link>

                    <Link
                        to="/login"
                        className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Denied;