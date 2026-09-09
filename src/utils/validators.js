import { Types } from "mongoose";

export function isValidId(id) {
    return Types.ObjectId.isValid(id);
}

export function isValidEmail(email) {
    return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
