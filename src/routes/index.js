import { Router } from "express";
import healthRouter from "./health.router.js";
import sessionsRouter from "./sessions.router.js";
import usersRouter from "./users.router.js";
import eventsRouter from "./events.router.js";
import enrollmentsRouter from "./enrollments.router.js";

//junto todos los routers en uno solo, asi app.js monta un solo /api
//y no tiene que conocer cada recurso por separado
const router = Router();

router.use("/health", healthRouter);
router.use("/sessions", sessionsRouter);
router.use("/users", usersRouter);
router.use("/events", eventsRouter);
router.use("/enrollments", enrollmentsRouter);

export default router;
