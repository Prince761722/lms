import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { setAuthToken } from "../../helpers/axiosInstance";

//  REGISTER 
export const registerAction = createAsyncThunk(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/register", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Registration failed"
            );
        }
    }
);

//  LOGIN 
export const loginAction = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/login", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Login failed"
            );
        }
    }
);

//  LOGOUT 
export const logoutAction = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/user/logout");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Logout failed"
            );
        }
    }
);

//  UPDATE PROFILE 
export const updateProfileAction = createAsyncThunk(
    "auth/profile/update",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("firstname", data.firstname);
            formData.append("lastname", data.lastname);
            formData.append("username", data.username);

            if (data.avtar) {
                formData.append("avtar", data.avtar);
            }

            const response = await axiosInstance.put(
                "/user/update_profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to update profile"
            );
        }
    }
);

//  INITIAL STATE 
const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
    role: localStorage.getItem("role") || "",
    data: JSON.parse(localStorage.getItem("data")) || {},
    token: localStorage.getItem("token") || null,  // ← added
    loading: false,
    error: null,
};

//  SLICE 
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},

    extraReducers: (builder) => {

        // ===== REGISTER =====
        builder
            .addCase(registerAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAction.fulfilled, (state, action) => {
                state.loading = false;

                const user = action.payload.user;
                const token = action.payload.token;  // ← get token

                state.isLoggedIn = true;
                state.data = { ...user };
                state.role = user?.role;
                state.token = token;  // ← save in state

                // Set token in axios immediately
                setAuthToken(token);

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", user?.role);
                localStorage.setItem("data", JSON.stringify(user));
                localStorage.setItem("token", token);  // ← save token
            })
            .addCase(registerAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ===== LOGIN =====
        builder
            .addCase(loginAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAction.fulfilled, (state, action) => {
                state.loading = false;

                const user = action.payload.user;
                const token = action.payload.token;  //  get token

                state.isLoggedIn = true;
                state.data = { ...user };
                state.role = user?.role;
                state.token = token;  //  save in state

                //  Set token in axios immediately
                setAuthToken(token);

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", user?.role);
                localStorage.setItem("data", JSON.stringify(user));
                localStorage.setItem("token", token);  //  save token
            })
            .addCase(loginAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ===== LOGOUT =====
        builder
            .addCase(logoutAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutAction.fulfilled, (state) => {
                state.loading = false;

                state.isLoggedIn = false;
                state.data = {};
                state.role = "";
                state.token = null;  // ← clear token

                // ✅ Clear token from axios
                setAuthToken(null);

                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("role");
                localStorage.removeItem("data");
                localStorage.removeItem("token"); 
            })
            .addCase(logoutAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ===== UPDATE PROFILE =====
        builder
            .addCase(updateProfileAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfileAction.fulfilled, (state, action) => {
                state.loading = false;

                const updatedUser = action.payload.user;
                state.data = { ...updatedUser };

                localStorage.setItem("data", JSON.stringify(updatedUser));
            })
            .addCase(updateProfileAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;