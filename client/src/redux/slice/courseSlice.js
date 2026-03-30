import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";


//  INITIAL STATE 
const initialState = {
    courseData: [],
    loading: false,
    error: null
};


//  GET ALL COURSES
export const getAllCourses = createAsyncThunk(
    "course/get",
    async (_, { rejectWithValue }) => {
        try {
            const response = axiosInstance.get("/courses"); // ✅ fixed

            toast.promise(response, {
                loading: "Loading course data...",
                success: "Courses loaded successfully",
                error: "Failed to get courses"
            });

            const res = await response;
            return res.data.courses;

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


//  CREATE COURSE 
export const createNewCourse = createAsyncThunk(
    "course/create",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            formData.append("title", data?.title);
            formData.append("description", data?.description);
            formData.append("category", data?.category);
            formData.append("createdBy", data?.createdBy);
            formData.append("thumbnail", data?.thumbnail);

            const response = axiosInstance.post("/courses", formData);

            toast.promise(response, {
                loading: "Creating course...",
                success: "Course created successfully",
                error: "Failed to create course"
            });

            const res = await response;
            return res.data.course;

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


//  UPDATE COURSE 
export const updateCourse = createAsyncThunk(
    "course/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = axiosInstance.put(`/courses/${id}`, data);

            toast.promise(response, {
                loading: "Updating course...",
                success: "Course updated",
                error: "Update failed"
            });

            const res = await response;
            return res.data.course;

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


//  DELETE COURSE 
export const deleteCourse = createAsyncThunk(
    "course/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = axiosInstance.delete(`/courses/${id}`);

            toast.promise(response, {
                loading: "Deleting course...",
                success: "Course deleted",
                error: "Delete failed"
            });

            await response;
            return id;

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


//  SLICE 
const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            //  GET 
            .addCase(getAllCourses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courseData = action.payload;
            })
            .addCase(getAllCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            //  CREATE 
            .addCase(createNewCourse.fulfilled, (state, action) => {
                state.courseData.push(action.payload);
            })
            .addCase(createNewCourse.rejected, (state, action) => {
                state.error = action.payload;
                toast.error(action.payload);
            })


            // UPDATE
            .addCase(updateCourse.fulfilled, (state, action) => {
                const index = state.courseData.findIndex(
                    (c) => c._id === action.payload._id
                );

                if (index !== -1) {
                    state.courseData[index] = action.payload;
                }
            })


            //  DELETE 
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.courseData = state.courseData.filter(
                    (course) => course._id !== action.payload
                );
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.error = action.payload;
                toast.error(action.payload);
            });
    }
});

export default courseSlice.reducer;