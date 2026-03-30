import dotenv from 'dotenv';
dotenv.config();
import User from '../models/userModel.js';
import appError from '../utils/errorUtil.js';
import cloudinary from '../config/cloudinaryConfig.js';
import fs from "fs";
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true
};

const register = async (req, res, next) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;

        if (!firstname || !lastname || !username || !email || !password) {
            return next(new appError("Please provide all the required fields", 400));
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return next(new appError("User already exists", 400));
        }

        const user = await User.create({
            firstname,
            lastname,
            username,
            email,
            password,
            avtar: {
                public_id: email,
                secure_url: 'https://api.dicebear.com/7.x/personas/svg?seed=anonymous'
            }
        });

        if (!user) {
            return next(new appError("Failed to create user", 500));
        }

        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "avtars",
                    width: 250,
                    height: 250,
                    gravity: "face",
                    crop: "fill"
                });

                if (result) {
                    user.avtar.public_id = result.public_id;
                    user.avtar.secure_url = result.secure_url;
                    await fs.promises.rm(`uploads/${req.file.filename}`);
                }
            } catch (error) {
                return next(new appError(error.message || "Failed to upload avatar", 500));
            }
        }

        await user.save();
        user.password = undefined;

        const token = user.getJWTToken();
        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user,
            token
        });
    } catch (error) {
        return next(new appError(error.message || "Internal Server Error", 500));
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new appError("Please provide email and password", 400));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return next(new appError("Invalid email or password", 401));
        }

        const token = await user.getJWTToken();
        user.password = undefined;
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "User Logged In Successfully",
            user,
            token
        });
    } catch (error) {
        return next(new appError(error.message || "Internal Server Error", 500));
    }
};

const logout = (req, res) => {
    res.cookie("token", null, {
        ...cookieOptions,
        expires: new Date(0)
    });
    res.status(200).json({
        success: true,
        message: "User Logged Out Successfully"
    });
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new appError("User not found", 404));
        }
        return res.status(200).json({
            success: true,
            message: "User Info Fetched Successfully",
            user
        });
    } catch (error) {
        return next(new appError(error.message || "Internal Server Error", 500));
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new appError("Please provide email", 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new appError("User not found", 404));
        }

        const resetToken = await user.getResetPasswordToken();
        await user.save();

        const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset_password/${resetToken}`;
        const message = `Your password reset token is: ${resetPasswordUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset",
                message
            });

            return res.status(200).json({
                success: true,
                message: `Email sent successfully to ${email}`
            });
        } catch (error) {
            user.forgetpasswordtoken = undefined;
            user.forgetpasswordexpiry = undefined;
            await user.save();
            return next(new appError(error.message || "Failed to send email", 500));
        }
    } catch (error) {
        return next(new appError(error.message || "Internal Server Error", 500));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { resetToken } = req.params;
        const { Password } = req.body;

        if (!resetToken) {
            return next(new appError("Reset token is required", 400));
        }

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        const user = await User.findOne({
            forgetpasswordtoken: hashedToken,
            forgetpasswordexpiry: { $gt: Date.now() }
        });

        if (!user) {
            return next(new appError("Invalid or expired reset token", 400));
        }

        user.password = Password;
        user.forgetpasswordtoken = undefined;
        user.forgetpasswordexpiry = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        return next(new appError(error.message || "Internal Server Error", 500));
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { id } = req.user;

        if (!oldPassword || !newPassword) {
            return next(new appError("Please provide old and new password", 400));
        }

        const user = await User.findById(id).select("+password");
        if (!user) {
            return next(new appError("User not found", 404));
        }

        const isPasswordMatched = await user.comparePassword(oldPassword);
        if (!isPasswordMatched) {
            return next(new appError("Old password is incorrect", 400));
        }

        user.password = newPassword;
        await user.save();
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        return next(new appError(error.message || "Internal Server Error", 500));
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { firstname, lastname, username } = req.body;
        const id = req.user.id;

        const user = await User.findById(id);
        if (!user) {
            return next(new appError("User not found", 404));
        }

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (username) user.username = username;

        if (req.file) {
            await cloudinary.v2.uploader.destroy(user.avtar.public_id);
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "avtars",
                    width: 250,
                    height: 250,
                    gravity: "face",
                    crop: "fill"
                });

                if (result) {
                    user.avtar.public_id = result.public_id;
                    user.avtar.secure_url = result.secure_url;
                    await fs.promises.rm(`uploads/${req.file.filename}`);
                }
            } catch (error) {
                return next(new appError(error.message || "Failed to upload avatar", 500));
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        return next(new appError(error.message || "Internal Server Error", 500));
    }
};

export { register, login, logout, getMe, forgotPassword, resetPassword, changePassword, updateProfile };