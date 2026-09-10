import { HttpError } from "../utils/httpError.js";
import { isValidEmail } from "../utils/validators.js";

const UPDATABLE_FIELDS = ["first_name", "last_name", "role"];

export class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    async getAll() {
        return this.repository.getAll();
    }

    async getByEmail(email) {
        if (!isValidEmail(email)) {
            throw new HttpError(400, "El email no tiene un formato válido");
        }

        const user = await this.repository.getByEmail(email);
        if (!user) {
            throw new HttpError(404, "Usuario no encontrado");
        }

        return user;
    }

    async update(email, data) {
        await this.getByEmail(email);

        const changes = {};
        for (const field of UPDATABLE_FIELDS) {
            if (data[field] !== undefined) changes[field] = data[field];
        }

        if (Object.keys(changes).length === 0) {
            throw new HttpError(400, `No se enviaron campos editables (${UPDATABLE_FIELDS.join(", ")})`);
        }

        return this.repository.updateByEmail(email, changes);
    }
}
