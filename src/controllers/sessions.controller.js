import { sessionsService } from "../services/index.js";

//el controller no valida ni hashea nada, solo agarra el body, se lo pasa al service
//y arma la respuesta. Toda la logica esta en sessions.service.js
export async function register(req, res, next) {
    try {
        const user = await sessionsService.register(req.body);
        res.status(201).json({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
}

//estas tres las dejo armadas pero todavia sin logica, entran en la proxima entrega
const pending = {
    status: "error",
    message: "Disponible en la próxima entrega"
};

export function login(req, res) {
    res.status(501).json(pending);
}

export function current(req, res) {
    res.status(501).json(pending);
}

export function logout(req, res) {
    res.status(501).json(pending);
}
