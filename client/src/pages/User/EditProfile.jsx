import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileAction } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state?.auth?.data);

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        previewImage: user?.avtar?.secure_url || "",
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        avtar: null
    });

    // IMAGE UPLOAD 
    function handleImageUpload(e) {
        const file = e.target.files[0];

        if (!file) {
            toast.error("Please select an image file");
            return;
        }

        // Get file extension
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

        // Check extension first (most reliable)
        if (!validExtensions.includes(fileExtension)) {
            toast.error(`❌ Invalid extension: ${fileExtension}. Allowed: ${validExtensions.join(', ')}`);
            return;
        }

        
        const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (file.type && !allowedFormats.includes(file.type)) {
            toast.error(`❌ Invalid MIME type: ${file.type}. Please ensure file is a valid image`);
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if (file.size > maxSize) {
            toast.error(`File too large (${fileSizeMB}MB). Max: 5MB`);
            return;
        }

        setData((prev) => ({
            ...prev,
            previewImage: URL.createObjectURL(file),
            avtar: file
        }));
        toast.success(`Profile image selected (${fileSizeMB}MB)`);
    }

    //  INPUT CHANGE 
    function handleInputChange(e) {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // SUBMIT 
    async function onFormSubmit(e) {
        e.preventDefault();

        if (!data.firstname || !data.lastname) {
            toast.error("Firstname & Lastname are required");
            return;
        }

        try {
            setLoading(true);

            const res = await dispatch(updateProfileAction(data));

            if (res.meta.requestStatus === "fulfilled") {
                toast.success("Profile updated successfully");
                navigate("/user/profile");
            } else {
                toast.error(res.payload || "Update failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-10 shadow-xl">

                {/* Heading */}
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                    Edit Profile
                </h1>

                {/* Form */}
                <form onSubmit={onFormSubmit} className="flex flex-col gap-6">

                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-28 h-28 rounded-full overflow-hidden border border-white/20 bg-white/5 flex items-center justify-center">
                            {data.previewImage ? (
                                <img
                                    src={data.previewImage}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white/40 text-sm">
                                    No Image
                                </span>
                            )}
                        </div>

                        <label className="text-sm text-yellow-400 cursor-pointer hover:underline">
                            Change Profile Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Inputs */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstname"
                            value={data.firstname}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 outline-none transition"
                        />

                        <input
                            type="text"
                            name="lastname"
                            value={data.lastname}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 outline-none transition"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 hover:-translate-y-0.5 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default EditProfile;