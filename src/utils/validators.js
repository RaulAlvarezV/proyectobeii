import { Types } from "mongoose";

//REGEX regular expressions
//texto sin @ ni espacios + @ + texto sin @ ni espacios + . + texto sin @ ni espacios
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//los id de mongo son ObjectId, si me mandan cualquier string tengo que cortar antes
//de ir a la base, sino mongoose tira CastError
export function isValidId(id) {
    return Types.ObjectId.isValid(id);
}

export function isValidEmail(email) {
    return typeof email === "string" && EMAIL_REGEX.test(email);
}
