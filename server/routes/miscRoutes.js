import { Router } from 'express';
import contact from "../controllers/miscController.js";

const router = Router();


router.post("/", contact);

export default router;