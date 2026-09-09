import { eventService } from "../services/index.js";

export async function getAll(req, res, next) {
    try {
        const events = await eventService.getAll(req.query);
        res.status(200).json({ status: "success", payload: events });
    } catch (error) {
        next(error);
    }
}

export async function getById(req, res, next) {
    try {
        const event = await eventService.getById(req.params.eid);
        res.status(200).json({ status: "success", payload: event });
    } catch (error) {
        next(error);
    }
}

export async function createEvent(req, res, next) {
    try {
        const event = await eventService.create(req.body);
        res.status(201).json({ status: "success", payload: event });
    } catch (error) {
        next(error);
    }
}

export async function updateEvent(req, res, next) {
    try {
        const event = await eventService.update(req.params.eid, req.body);
        res.status(200).json({ status: "success", payload: event });
    } catch (error) {
        next(error);
    }
}

export async function deleteEvent(req, res, next) {
    try {
        await eventService.delete(req.params.eid);
        res.status(200).json({ status: "success", message: "Evento eliminado" });
    } catch (error) {
        next(error);
    }
}
