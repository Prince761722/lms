import { configureStore } from '@reduxjs/toolkit';

import authSliceReducer from './slice/authSlice.js';
import courseSliceReducer from './slice/courseSlice.js';
import paymentSliceReducer from './slice/razorpaySlice.js';
import lectureReducer from './slice/leactureSlice.js';
import creatorReducer from './slice/creatorSlice.js';

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        payment: paymentSliceReducer,
        lecture: lectureReducer,
        creator: creatorReducer,
    },
    devTools: true,
});

export default store;
