import Course from '../models/courseModel.js';
import appError from '../utils/errorUtil.js';
import fs from "fs";
import cloudinary from '../config/cloudinaryConfig.js';


//  GET ALL COURSES 
const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            success: true,
            count: courses.length,
            courses
        });

    } catch (error) {
        next(error);
    }
};


//  GET COURSE LECTURES 
const getCourseLectures = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return next(new appError("Course not found", 404));
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


// CREATE COURSE 
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return next(new appError("All fields are required", 400));
    }

   
    const createdBy = req.user.id;

    const course = await Course.create({
      title,
      description,
      category,
      createdBy, 
      thumbnail: {},
    });

    // IMAGE UPLOAD
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "lms/courses",
          resource_type: "image",
        }
      );

      course.thumbnail.public_id = result.public_id;
      course.thumbnail.secure_url = result.secure_url;

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

//  UPDATE COURSE 
const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!course) {
            return next(new appError("Course not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });

    } catch (error) {
        next(new appError(error.message, 500));
    }
};


//  DELETE COURSE 
const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return next(new appError("Course not found", 404));
        }

       
        if (course.thumbnail?.public_id) {
            await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
        }

        // delete lecture videos
        for (const lec of course.lectures) {
            if (lec.lecture?.public_id) {
                await cloudinary.v2.uploader.destroy(
                    lec.lecture.public_id,
                    { resource_type: "video" } 
                );
            }
        }

        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        next(new appError(error.message, 500));
    }
};


const addLectureByCourseId = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;

        if (!title || !description) {
            return next(new appError("All fields are required", 400));
        }

        const course = await Course.findById(id);

        if (!course) {
            return next(new appError("Course not found", 404));
        }

        if (!req.file) {
            return next(new appError("Lecture video is required", 400));
        }

        //  UPLOAD VIDEO
        const result = await cloudinary.v2.uploader.upload(
            req.file.path,
            {
                folder: "lms/lectures",
                resource_type: "video"
            }
        );

        //  AUTO THUMBNAIL
        const thumbnailUrl = cloudinary.v2.url(result.public_id, {
            resource_type: "video",
            format: "jpg",
            width: 400,
            height: 250,
            crop: "fill"
        });

        const lectureData = {
            title,
            description,

            lecture: {
                public_id: result.public_id,
                secure_url: result.secure_url
            },

            thumbnail: {
                public_id: result.public_id,
                secure_url: thumbnailUrl
            }
        };

        await fs.promises.rm(req.file.path);

        course.lectures.push(lectureData);
        course.numbersOfLectures = course.lectures.length;

        await course.save();

        res.status(201).json({
            success: true,
            message: "Lecture added successfully",
            lecture: lectureData
        });

    } catch (error) {
        next(new appError(error.message, 500));
    }
};
//  DELETE LECTURE 
const removeLecture = async (req, res, next) => {
    try {
        const { courseId, lectureId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new appError("Course not found", 404));
        }

        const lecture = course.lectures.find(
            (lec) => lec._id.toString() === lectureId
        );

        if (!lecture) {
            return next(new appError("Lecture not found", 404));
        }

        // delete from cloudinary (VIDEO)
        if (lecture.lecture?.public_id) {
            await cloudinary.v2.uploader.destroy(
                lecture.lecture.public_id,
                { resource_type: "video" } 
            );
        }

        course.lectures = course.lectures.filter(
            (lec) => lec._id.toString() !== lectureId
        );

        course.numbersOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: "Lecture deleted successfully",
            lectures: course.lectures,
        });

    } catch (error) {
        next(new appError(error.message, 500));
    }
};


export {
    getAllCourses,
    getCourseLectures,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureByCourseId,
    removeLecture
};