import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";


// ================== ASYNC THUNKS ==================

export const getRazorpayKey = createAsyncThunk(
  "payment/getKey",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/payment/razorpay-key");
      return res.data.key;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);


export const buySubscription = createAsyncThunk(
  "payment/buySubscription",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/subscribe"); // ✅ FIX: POST
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);


export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/payment/verify", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);


export const cancelSubscription = createAsyncThunk(
  "payment/cancel",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/payment/unsubscribe");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);


export const fetchDashboardData = createAsyncThunk(
  "payment/dashboard",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/payment/");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);


//  INITIAL STATE 

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,

  overview: {
    totalRevenue: 0,
    totalPayments: 0,
  },

  monthlyStats: [],
  yearlyStats: [],
  recentPayments: [],

  allPayments: [],

  loading: false,
  error: null,
};


//  SLICE 

const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    clearPaymentState: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      //  GET KEY 
      .addCase(getRazorpayKey.rejected, (_, action) => {
        toast.error(action.payload || "Failed to get key");
      })


      // SUBSCRIBE 
      .addCase(buySubscription.pending, () => {
        toast.loading("Creating subscription...");
      })
      .addCase(buySubscription.fulfilled, (state, action) => {
        toast.dismiss();
        toast.success("Subscription created");

        state.subscription_id = action.payload.subscription_id;
      })
      .addCase(buySubscription.rejected, (_, action) => {
        toast.dismiss();
        toast.error(action.payload || "Subscription failed");
      })


      //  VERIFY 
      .addCase(verifyPayment.pending, () => {
        toast.loading("Verifying payment...");
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        toast.dismiss();
        toast.success("Payment verified successfully");

        state.isPaymentVerified = true;
      })
      .addCase(verifyPayment.rejected, (_, action) => {
        toast.dismiss();
        toast.error(action.payload || "Payment verification failed");
      })


      //  CANCEL 
      .addCase(cancelSubscription.fulfilled, () => {
        toast.success("Subscription cancelled");
      })
      .addCase(cancelSubscription.rejected, (_, action) => {
        toast.error(action.payload || "Cancel failed");
      })


      // DASHBOARD 
      .addCase(fetchDashboardData.rejected, (_, action) => {
        toast.error(action.payload || "Failed to load dashboard");
      });
  },
});


export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;