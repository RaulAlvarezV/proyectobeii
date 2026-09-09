import { enrollmentService } from "../services/index.js";

export async function getAll(req, res, next) {
    try {
        const enrollments = await enrollmentService.getAll(req.query);
        res.status(200).json({ status: "success", payload: enrollments });
    } catch (error) {
        next(error);
    }
}

export async function getById(req, res, next) {
    try {
        const enrollment = await enrollmentService.getById(req.params.enid);
        res.status(200).json({ status: "success", payload: enrollment });
    } catch (error) {
        next(error);
    }
}

export async function createEnrollment(req, res, next) {
    try {
        const enrollment = await enrollmentService.create(req.params.uid, req.params.eid);
        res.status(201).json({ status: "success", payload: enrollment });
    } catch (error) {
        next(error);
    }
}
