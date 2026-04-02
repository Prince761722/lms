import { Router } from 'express';
import { isLoggedIn, authorizedRoles, isSubscribed, isCourseOwner, isSubscribedOrOwner, isAdminOrOwner } from '../middlewares/authMiddleware.js';
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
    authorizedRoles('admin', 'creator'), 
    upload.single('thumbnail'),
    createCourse
  );

router.route('/:id')
  .get(isLoggedIn, isSubscribedOrOwner, getCourseLectures)
  .put(isLoggedIn, isAdminOrOwner, updateCourse)
  .delete(isLoggedIn, isAdminOrOwner, removeCourse);

router.post(
  '/:id/lecture',
  isLoggedIn,
  isAdminOrOwner,
  upload.single('lecture'),
  addLectureByCourseId
);

router.delete(
  '/:courseId/lecture/:lectureId',
  isLoggedIn,
  isAdminOrOwner,
  removeLecture
);

export default router;