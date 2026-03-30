import toast from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/footer";
import { logoutAction } from "../redux/slice/authSlice";

function HomeLayout({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const role = useSelector((state) => state?.auth?.role);

    function closeDrawer() {
        const drawer = document.getElementById("my-drawer");
        if (drawer) drawer.checked = false;
    }

    async function handleLogout(e) {
        e.preventDefault();
        closeDrawer();
        const promise = dispatch(logoutAction()).unwrap();

        await toast.promise(promise, {
            loading: "Logging out...",
            success: "Logged out successfully 👋",
            error: "Logout failed ❌",
        });

        navigate('/');
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="drawer flex-1">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />

                {/* CONTENT */}
                <div className="drawer-content">
                    <div className="p-4">
                        <label htmlFor="my-drawer" className="cursor-pointer">
                            <FiMenu size={32} className="text-white" />
                        </label>
                    </div>
                    {children}
                </div>

                
                <div className="drawer-side z-50">
                    <label
                        htmlFor="my-drawer"
                        className="drawer-overlay"
                        onClick={closeDrawer}
                    ></label>

                    <ul className="menu p-4 w-64 h-full bg-base-200 text-base-content relative">

                        <li className="absolute right-2 top-2">
                            <button onClick={closeDrawer}>
                                <AiFillCloseCircle size={22} />
                            </button>
                        </li>

                        <li className="mt-10" onClick={closeDrawer}>
                            <Link to="/">Home</Link>
                        </li>

                        {isLoggedIn && role === "admin" && (
                            <li onClick={closeDrawer}>
                                <Link to="/admin/dashboard">Admin Dashboard</Link>
                            </li>
                        )}

                        <li onClick={closeDrawer}>
                            <Link to="/courses">All Courses</Link>
                        </li>

                        <li onClick={closeDrawer}>
                            <Link to="/about">About Us</Link>
                        </li>

                        <li onClick={closeDrawer}>
                            <Link to="/contact">Contact Us</Link>
                        </li>

                        {!isLoggedIn && (
                            <div className="flex flex-col gap-2 mt-4 px-2">
                                <Link
                                    to="/login"
                                    className="btn btn-primary w-full"
                                    onClick={closeDrawer}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn btn-secondary w-full"
                                    onClick={closeDrawer}
                                >
                                    Signup
                                </Link>
                            </div>
                        )}

                        {isLoggedIn && (
                            <div className="flex flex-col gap-2 mt-4 px-2">
                                <Link
                                    to="/user/profile"
                                    className="btn btn-primary w-full"
                                    onClick={closeDrawer}
                                >
                                    Profile
                                </Link>
                                <button
                                    className="btn btn-secondary w-full"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HomeLayout;