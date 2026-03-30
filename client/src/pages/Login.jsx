import { useState } from "react";
import toast from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/homeLayout";
import { loginAction } from "../redux/slice/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const loginUser = async (e) => {
        e.preventDefault();

        // ─── Empty Field Validation ──────────────────────────────────
        if (!loginData.email || !loginData.password) {
            toast.error("All fields are required");
            return;
        }

        // ─── Email Validation ────────────────────────────────────────
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(loginData.email)) {
            toast.error("Please enter a valid email address 📧");
            return;
        }

        //  Password Validation 
        if (loginData.password.length < 8) {
            toast.error("Password must be at least 8 characters 🔒");
            return;
        }

        //  API Call with Toast 
        const promise = dispatch(loginAction(loginData)).unwrap();

        await toast.promise(promise, {
            loading: "Logging in...",
            success: "Logged in successfully 🎉",
            error: "Login failed ❌",
        });

        navigate("/");
    };

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh] px-4">
                <form
                    onSubmit={loginUser}
                    className="flex flex-col gap-4 rounded-2xl p-6 text-white w-full max-w-md bg-[#1A2238] shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                >
                    <h1 className="text-center text-2xl font-semibold">
                        Login Page
                    </h1>

                    {/* ── Email ── */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={loginData.email}
                            onChange={handleTextChange}
                            className="px-3 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    {/* ── Password ── */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={handleTextChange}
                            className="px-3 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    {/* ── Submit Button ── */}
                    <button
                        type="submit"
                        className="mt-2 bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                        Login
                    </button>

                    {/* ── Signup Redirect ── */}
                    <p className="text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-yellow-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>

                </form>
            </div>
        </HomeLayout>
    );
}

export default Login;