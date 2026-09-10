import { Router } from "express";
import { register, login, current, logout } from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", register);

//las de abajo todavia responden 501, las implemento en la proxima entrega
router.post("/login", login);
router.get("/current", current);
router.post("/logout", logout);

export default router;
