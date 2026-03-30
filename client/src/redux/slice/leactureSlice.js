import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";

 // GET LECTURES
export const getCourseLectures = createAsyncThunk(
  "lecture/getCourseLectures",
  async (courseId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}`);

      
      return res.data.lectures || res.data.course?.lectures || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

//  ADD LECTURE 
export const addLecture = createAsyncThunk(
  "lecture/addLecture",
  async ({ courseId, formData }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        `/courses/${courseId}/lecture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data.lecture;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

//  DELETE 
export const deleteLecture = createAsyncThunk(
  "lecture/deleteLecture",
  async ({ courseId, lectureId }, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(
        `/courses/${courseId}/lecture/${lectureId}`
      );

      return {
        lectureId,
        lectures: res.data.lectures
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// STATE 
const initialState = {
  lectures: [],
  loading: false,
  error: null,
};

//  SLICE 
const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {
    clearLectureState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== GET =====
      .addCase(getCourseLectures.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCourseLectures.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures = action.payload;
      })
      .addCase(getCourseLectures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch lectures");
      })

      // ===== ADD =====
      .addCase(addLecture.pending, () => {
        toast.loading("Uploading lecture...");
      })
      .addCase(addLecture.fulfilled, (state, action) => {
        toast.dismiss();
        toast.success("Lecture added");

        
        state.lectures = [action.payload, ...state.lectures];
      })
      .addCase(addLecture.rejected, (_, action) => {
        toast.dismiss();
        toast.error(action.payload || "Upload failed");
      })

      //  DELETE 
      .addCase(deleteLecture.pending, () => {
        toast.loading("Deleting lecture...");
      })
      .addCase(deleteLecture.fulfilled, (state, action) => {
        toast.dismiss();
        toast.success("Lecture deleted");

        if (action.payload.lectures) {
          state.lectures = action.payload.lectures;
        } else {
          state.lectures = state.lectures.filter(
            (lec) => lec._id !== action.payload.lectureId
          );
        }
      })
      .addCase(deleteLecture.rejected, (_, action) => {
        toast.dismiss();
        toast.error(action.payload || "Delete failed");
      });
  },
});

export const { clearLectureState } = lectureSlice.actions;
export default lectureSlice.reducer;