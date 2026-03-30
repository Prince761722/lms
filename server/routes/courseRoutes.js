import { Router } from 'express';
import { isLoggedIn, authorizedRoles } from '../middlewares/authMiddleware.js';
import upload from "../middlewares/fileConverter.js";

import {
  getAllCourses,
  getCourseLectures,
  createCourse,
  updateCourse,
  removeCourse,
  addLectureByCourseId,
  removeLecture
} from '../controllers/courseController.js';

const router = Router();



router.route('/')
  .get(isLoggedIn, getAllCourses)
  .post(
    isLoggedIn,
    authorizedRoles('admin'),
    upload.single('thumbnail'),
    createCourse
  );



router.route('/:id')
  .get(isLoggedIn, getCourseLectures)
  .put(isLoggedIn, authorizedRoles('admin'), updateCourse)
  .delete(isLoggedIn, authorizedRoles('admin'), removeCourse);



router.post(
  '/:id/lecture',
  isLoggedIn,
  authorizedRoles('admin'),
  upload.single('lecture'), 
  addLectureByCourseId
);


router.delete(
  '/:courseId/lecture/:lectureId',
  isLoggedIn,
  authorizedRoles('admin'),
  removeLecture
);


export default router;