import { HttpError } from "../utils/httpError.js";
import { isValidId } from "../utils/validators.js";

export class EventService {
    constructor(repository) {
        this.repository = repository;
    }

    //armo el filtro a mano y no le paso req.query directo al dao,
    //sino cualquiera me manda campos raros por la url y me consulta lo que quiere
    async getAll(query = {}) {
        const filter = {};
        if (query.type) filter.type = query.type;
        if (query.status) filter.status = query.status;
        if (query.category && isValidId(query.category)) filter.category = query.category;

        return this.repository.getAll(filter);
    }

    async getById(id) {
        if (!isValidId(id)) {
            throw new HttpError(400, "El id del evento no es válido");
        }

        const event = await this.repository.getById(id);
        if (!event) {
            throw new HttpError(404, "Evento no encontrado");
        }

        return event;
    }

    async create(data) {
        return this.repository.create(data);
    }

    async update(id, data) {
        await this.getById(id);
        return this.repository.update(id, data);
    }

    async delete(id) {
        await this.getById(id);
        return this.repository.delete(id);
    }
}
