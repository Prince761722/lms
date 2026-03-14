import { Router } from 'express';
import { isLoggedIn, authorizedRoles } from '../middlewares/authMiddleware.js';
import upload from "../middlewares/fileConverter.js"
import { getAllCourses, getCourseLectures, createCourse, updateCourse, removeCourse,addLectureByCourseId } from '../controllers/courseController.js'
const router = Router();

router.route('/')
    .get(isLoggedIn, getAllCourses)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('thumbnail'), createCourse);

router.route('/:id')
    .get(isLoggedIn, getCourseLectures)
    .put(isLoggedIn, authorizedRoles('ADMIN'), updateCourse)
    .delete(isLoggedIn, authorizedRoles('ADMIN'), removeCourse)
    .post(isLoggedIn, authorizedRoles('ADMIN'), addLectureByCourseId);


export default router;


