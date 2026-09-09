import { Router } from "express";
import { getAll, getById, createEnrollment } from "../controllers/enrollments.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:enid", getById);
router.post("/:uid/:eid", createEnrollment);

export default router;
