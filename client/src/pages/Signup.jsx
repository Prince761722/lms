import { useState } from "react";
import toast from 'react-hot-toast';
import { FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/homeLayout";
import { registerAction } from "../redux/slice/authSlice";

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [signupData, setSignupData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const registerUser = async (e) => {
        e.preventDefault();

        // ─── Basic Empty Field Validation ──────────────────────────────
        if (
            !signupData.firstname ||
            !signupData.lastname ||
            !signupData.username ||
            !signupData.email ||
            !signupData.password
        ) {
            toast.error("All fields are required");
            return;
        }

        // ─── Email Validation ───────────────────────────────────────────
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signupData.email)) {
            toast.error("Please enter a valid email address 📧");
            return;
        }

        // ─── Password Validation ────────────────────────────────────────
        if (signupData.password.length < 8) {
            toast.error("Password must be at least 8 characters 🔒");
            return;
        }
        if (!/[A-Z]/.test(signupData.password)) {
            toast.error("Password must contain at least one uppercase letter");
            return;
        }
        if (!/[a-z]/.test(signupData.password)) {
            toast.error("Password must contain at least one lowercase letter");
            return;
        }
        if (!/[0-9]/.test(signupData.password)) {
            toast.error("Password must contain at least one number");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(signupData.password)) {
            toast.error("Password must contain at least one special character");
            return;
        }

        // ─── Build FormData ─────────────────────────────────────────────
        const data = new FormData();
        data.append("firstname", signupData.firstname);
        data.append("lastname", signupData.lastname);
        data.append("username", signupData.username);
        data.append("email", signupData.email);
        data.append("password", signupData.password);

        if (image) {
            data.append('avtar', image); 
        }

        // ─── API Call with Toast
        const promise = dispatch(registerAction(data)).unwrap();

        await toast.promise(promise, {
            loading: "Registering...",
            success: "Account created successfully 🎉",
            error: "Registration failed ❌",
        });

        navigate("/");
    };

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh] px-4">
                <form
                    onSubmit={registerUser}
                    className="flex flex-col gap-4 rounded-2xl p-6 text-white w-full max-w-md bg-[#1A2238] shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                >
                    <h1 className="text-center text-2xl font-semibold">
                        Create Account
                    </h1>

                    {/* ── Profile Image ── */}
                    <div className="flex flex-col items-center gap-2">
                        <label className="cursor-pointer relative">
                            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-500 hover:border-yellow-500 transition">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="text-4xl text-gray-300" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                        <p className="text-xs text-gray-400">Upload Profile Picture</p>
                    </div>

                    {/* ── Name Fields ── */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            value={signupData.firstname}
                            onChange={handleTextChange}
                            className="w-1/2 px-3 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            value={signupData.lastname}
                            onChange={handleTextChange}
                            className="w-1/2 px-3 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    {/* ── Username ── */}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={signupData.username}
                        onChange={handleTextChange}
                        className="px-3 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    {/* ── Email ── */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={signupData.email}
                        onChange={handleTextChange}
                        className="px-3 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    {/* ── Password ── */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={signupData.password}
                        onChange={handleTextChange}
                        className="px-3 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    {/* ── Submit Button ── */}
                    <button
                        type="submit"
                        className="mt-2 bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                        Register
                    </button>

                    {/* ── Login Redirect ── */}
                    <p className="text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-yellow-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </HomeLayout>
    );
}

export default Signup;