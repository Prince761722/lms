
import { Router } from "express";
import{getCreatorRequests,handleCreatorRequest,requestCreatorAccess} from '../controllers/multiCreatorController.js'
import { isLoggedIn, authorizedRoles } from "../middlewares/authMiddleware.js";
const router=Router();

router.post("/request", isLoggedIn, requestCreatorAccess);

router.get(
  "/requests",
  isLoggedIn,
  authorizedRoles("admin"),
  getCreatorRequests
);

router.post(
  "/approve",
  isLoggedIn,
  authorizedRoles("admin"),
  handleCreatorRequest
);

export default router;