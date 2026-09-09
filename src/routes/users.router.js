import { Router } from "express";
import { getAll, getByEmail, update } from "../controllers/users.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:email", getByEmail);
router.put("/:email", update);

export default router;
