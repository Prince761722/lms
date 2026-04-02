import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";


// USER REQUEST

export const requestCreatorAccess = createAsyncThunk(
  "creator/request",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/creator/request");
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message);
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// ADMIN - GET REQUESTS

export const getCreatorRequests = createAsyncThunk(
  "creator/getRequests",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/creator/requests");
      return res.data.users;
    } catch (err) {
      toast.error(err.response?.data?.message);
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);


// ADMIN - APPROVE / REJECT

export const handleCreatorRequest = createAsyncThunk(
  "creator/handle",
  async ({ userId, action }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/creator/approve`, { userId, action });

      toast.success(res.data.message);
      return { userId, action };
    } catch (err) {
      toast.error(err.response?.data?.message);
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);



const creatorSlice = createSlice({
  name: "creator",

  initialState: {
    requests: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

   
      // REQUEST CREATOR
  
      .addCase(requestCreatorAccess.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestCreatorAccess.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestCreatorAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET REQUESTS
     
      .addCase(getCreatorRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCreatorRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getCreatorRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
      // APPROVE / REJECT
    
      .addCase(handleCreatorRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(
          (u) => u._id !== action.payload.userId
        );
      });
  },
});

export default creatorSlice.reducer;