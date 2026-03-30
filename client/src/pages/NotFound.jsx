import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[#1A2238] text-white px-4">
            
            {/* 404 */}
            <h1 className="text-9xl font-extrabold">404</h1>

            {/* Message */}
            <p className="mt-4 text-2xl font-semibold">Page Not Found</p>
            <p className="mt-2 text-gray-400 text-center max-w-md">
                The page you are looking for doesn’t exist or has been moved.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
                
                {/* Go Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                    Go Back
                </button>

                {/* Go Home */}
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition"
                >
                    Go Home
                </button>

            </div>
        </div>
    );
}

export default NotFound;