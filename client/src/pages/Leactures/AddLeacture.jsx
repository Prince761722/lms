import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addLecture } from "../../redux/slice/leactureSlice";
import HomeLayout from "../../Layouts/homeLayout";

function AddLecture() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams(); 

    const videoRef = useRef(null);

    const [form, setForm] = useState({
        title: "",
        description: ""
    });

    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

   
    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

  
    const handleVideo = (file) => {
        if (!file || !file.type.startsWith("video/")) return;

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    const handleFileInput = (e) => {
        handleVideo(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleVideo(e.dataTransfer.files[0]);
    };

   
    const handleSubmit = async () => {
        if (!form.title.trim() || !videoFile) return;

        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("description", form.description);

        
        formData.append("lecture", videoFile);

        setUploading(true);

        const result = await dispatch(
            addLecture({ courseId, formData })
        );

        setUploading(false);

        if (!result?.error) {
            navigate(`/lecture/${courseId}`); 
        }
    };

    const clearVideo = () => {
        setVideoFile(null);
        setVideoPreview("");
        if (videoRef.current) videoRef.current.value = "";
    };

    const isValid = form.title.trim() && videoFile;

    return (
        <HomeLayout>
            <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
                <div className="max-w-2xl mx-auto">

                   
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white/40 hover:text-white mb-6"
                    >
                        ← Back
                    </button>

                    <h1 className="text-2xl font-bold mb-6">
                        Add New Lecture
                    </h1>

                    {/* FORM */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Lecture title"
                            className="w-full bg-black border border-white/10 px-4 py-3 rounded"
                        />

                       
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full bg-black border border-white/10 px-4 py-3 rounded"
                        />

                    
                        {!videoPreview ? (
                            <label
                                onDrop={handleDrop}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                className={`block border-2 border-dashed p-10 text-center cursor-pointer rounded ${
                                    dragOver ? "border-yellow-400" : "border-white/10"
                                }`}
                            >
                                Upload Video
                                <input
                                    ref={videoRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                            </label>
                        ) : (
                            <div>
                                <video
                                    src={videoPreview}
                                    controls
                                    className="w-full rounded"
                                />

                                <button
                                    onClick={clearVideo}
                                    className="text-red-400 mt-2"
                                >
                                    Remove Video
                                </button>
                            </div>
                        )}

                     
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || uploading}
                            className="w-full bg-yellow-400 text-black py-3 rounded font-bold"
                        >
                            {uploading ? "Uploading..." : "Upload Lecture"}
                        </button>

                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default AddLecture;