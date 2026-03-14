import Course from '../models/courseModel.js';
import appError from '../utils/errorUtil.js';
import fs from "fs";
import cloudinary from '../config/cloudinaryConfig.js';



const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course
            .find({})
            .select('-lectures');

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found"
            });
        }

        res.status(200).json({
            success: true,
            count: courses.length,
            courses
        });

    } catch (error) {
        next(error);
    }
};

const getCourseLectures = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id).populate("lectures");


        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }


        if (!course.lectures || course.lectures.length === 0) {
            return res.status(200).json({
                success: true,
                lectures: [],
                message: "No lectures available for this course"
            });
        }


        res.status(200).json({
            success: true,
            count: course.lectures.length,
            lectures: course.lectures,
        });

    } catch (error) {
        next(error);
    }
};

const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, createdBy } = req.body;

        if (!title || !description || !category || !createdBy) {
            return next(
                new appError("All fields are required", 400)
            );
        }

        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {}
        });

        if (!course) {
            return next(
                new appError("Course could not be created, please try again", 500)
            );
        }

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(
                req.file.path,
                { folder: "lms" }
            );

            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }

            await fs.promises.rm(req.file.path);
        }

        await course.save();

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });

    } catch (error) {
        next(error);
    }
};


const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndUpdate(
            id,
            { $set: req.body },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!course) {
            return next(
                new appError("Course not found", 404)
            );
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });

    } catch (e) {
        return next(
            new appError(e.message, 500)
        );
    }
};

const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return next(
                new appError("Course not found", 404)
            );
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        return next(
            new appError(error.message, 500)
        );
    }
};

const addLectureByCourseId = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;

        if (!title || !description) {
            return next(
                new appError("All fields are required", 400)
            );
        }

        const course = await Course.findById(id);

        if (!course) {
            return next(
                new appError("Course not found", 404)
            );
        }

        const lectureData = {
            title,
            description,
            thumbnail: {}
        };

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(
                req.file.path,
                { folder: "lms" }
            );

            if (result) {
                lectureData.thumbnail.public_id = result.public_id;
                lectureData.thumbnail.secure_url = result.secure_url;
            }

            await fs.promises.rm(req.file.path);
        }

       
        course.lectures.push(lectureData);
        course.numbersOfLectures=course.leactures.length;

        await course.save();

        res.status(201).json({
            success: true,
            message: "Lecture added successfully",
            lecture: lectureData,
        });

    } catch (error) {
        next(new appError(error.message, 500));
    }
};



export { getAllCourses, getCourseLectures, createCourse, updateCourse, removeCourse,addLectureByCourseId };

