import { userService } from "../services/index.js";

export async function getAll(req, res, next) {
    try {
        const users = await userService.getAll();
        res.status(200).json({ status: "success", payload: users });
    } catch (error) {
        next(error);
    }
}

export async function getByEmail(req, res, next) {
    try {
        const user = await userService.getByEmail(req.params.email);
        res.status(200).json({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
}

export async function update(req, res, next) {
    try {
        const user = await userService.update(req.params.email, req.body);
        res.status(200).json({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
}
