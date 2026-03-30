import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuImagePlus } from "react-icons/lu";
import toast from "react-hot-toast";
import { createNewCourse } from "../../redux/slice/courseSlice";

function CreateCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        title: "",
        category: "",
        createdBy: "",
        description: "",
        thumbnail: null,
        previewImage: ""
    });

    function handleImageUpload(e) {
        const uploadedImage = e.target.files[0];

        if (uploadedImage) {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(uploadedImage);

            fileReader.onload = function () {
                setUserInput({
                    ...userInput,
                    previewImage: fileReader.result,
                    thumbnail: uploadedImage
                });
            };
        }
    }

    function handleUserInput(e) {
        const { name, value } = e.target;

        setUserInput({
            ...userInput,
            [name]: value
        });
    }

    async function formSubmit(e) {
        e.preventDefault();

        if (
            !userInput.title ||
            !userInput.description ||
            !userInput.category ||
            !userInput.thumbnail ||
            !userInput.createdBy
        ) {
            toast.error("All Fields are Mandatory");
            return;
        }

        const response = await dispatch(createNewCourse(userInput));

        if (response?.payload?.success) {
            setUserInput({
                title: "",
                category: "",
                createdBy: "",
                description: "",
                thumbnail: null,
                previewImage: ""
            });

            navigate("/courses");
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white px-4 py-8">

            
            <button
                onClick={() => navigate(-1)}
                className="mb-6 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition"
            >
                ← Back
            </button>

            
            <div className="max-w-5xl mx-auto bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">

                <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
                    Create New Course
                </h2>

                <form onSubmit={formSubmit} className="space-y-5">

                    
                    <input
                        type="text"
                        name="title"
                        value={userInput.title}
                        onChange={handleUserInput}
                        placeholder="Course Title"
                        className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-yellow-500 outline-none"
                    />

                    
                    <input
                        type="text"
                        name="category"
                        value={userInput.category}
                        onChange={handleUserInput}
                        placeholder="Category"
                        className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-yellow-500 outline-none"
                    />

                    
                    <input
                        type="text"
                        name="createdBy"
                        value={userInput.createdBy}
                        onChange={handleUserInput}
                        placeholder="Instructor Name"
                        className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-yellow-500 outline-none"
                    />

                   
                    <textarea
                        name="description"
                        value={userInput.description}
                        onChange={handleUserInput}
                        placeholder="Course Description"
                        rows="4"
                        className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-yellow-500 outline-none"
                    />

                    
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Course Thumbnail</label>

                        <label className="w-full h-52 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition overflow-hidden">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            {userInput.previewImage ? (
                                <img
                                    src={userInput.previewImage}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-gray-500">
                                    <LuImagePlus size={40} />
                                    <p className="text-sm mt-2">Click to upload image</p>
                                </div>
                            )}
                        </label>
                    </div>

                    
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition duration-300 shadow-md"
                    >
                        Create Course 🚀
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CreateCourse;