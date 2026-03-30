import { configureStore } from '@reduxjs/toolkit';

import authSliceReducer from './slice/authSlice.js';
import courseSliceReducer from './slice/courseSlice.js';
import paymentSliceReducer from './slice/razorpaySlice.js';
import lectureReducer from './slice/leactureSlice.js';

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        payment: paymentSliceReducer,
        lecture: lectureReducer,
    },
    devTools: true,
});

export default store;
