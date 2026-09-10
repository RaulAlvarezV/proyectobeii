import { HttpError } from "../utils/httpError.js";
import { isValidEmail } from "../utils/validators.js";
import { hashPassword } from "../utils/hash.js";

//lo dejo como constante para no tener el 6 suelto tirado abajo
const MIN_PASSWORD_LENGTH = 6;

export class SessionsService {
    constructor(repository) {
        this.repository = repository;
    }

    async register(userData) {
        const { first_name, last_name, email, password } = userData;

        //validamos los campos obligatorios, los que marcamos como required en el modelo
        if (!first_name || !last_name || !email || !password) {
            throw new HttpError(400, "Faltan campos obligatorios");
        }

        //normalizo el email PRIMERO, antes de validarlo y antes de buscarlo. Dos motivos:
        //1) si valido "Ana@Mail.com " tal cual viene, el espacio del final me lo rechaza el regex
        //2) si lo busco sin normalizar no matchea con el "ana@mail.com" guardado y lo duplico
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        //validamos el email
        if (!isValidEmail(normalizedEmail)) {
            throw new HttpError(400, "El email no tiene un formato válido");
        }

        //validamos el largo del password
        if (password.length < MIN_PASSWORD_LENGTH) {
            throw new HttpError(400, `El password debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
        }

        //validamos que el email no este registrado
        const emailExists = await this.repository.getByEmail(normalizedEmail);
        if (emailExists) {
            throw new HttpError(409, "El email ya está registrado");
        }

        //hasheamos el password, nunca lo guardamos como viene
        const hashedPassword = await hashPassword(password);

        //el role NO lo tomo del body a proposito, sino cualquiera se registra como admin.
        //el modelo le pone player por default
        return this.repository.create({
            first_name,
            last_name,
            email: normalizedEmail,
            password: hashedPassword
        });
    }
}
