import { Router } from "express";
import { changePassword, forgotPassword, getMe, login, logout, register, resetPassword, updateProfile, } from "../controllers/userController.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/fileConverter.js";
const router=Router();
// Define user-related routes here

router.post('/register',upload.single("avatar"),register);
router.post('/login',login)
router.get('/logout',logout)
router.get('/me',isLoggedIn,getMe);
router.post('/forgot_password',forgotPassword);
router.post('/reset_password/:resetToken',resetPassword)
router.post('/change_password',isLoggedIn,changePassword)
router.put('/update_profile',isLoggedIn,upload.single("avatar"),updateProfile);
export default router;