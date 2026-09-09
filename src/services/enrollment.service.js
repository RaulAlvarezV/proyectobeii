import { HttpError } from "../utils/httpError.js";
import { isValidId } from "../utils/validators.js";

export class EnrollmentService {
    constructor(repository, eventService, userRepository) {
        this.repository = repository;
        this.eventService = eventService;
        this.userRepository = userRepository;
    }

    async getAll(query = {}) {
        const filter = {};
        if (query.event && isValidId(query.event)) filter.event = query.event;
        if (query.user && isValidId(query.user)) filter.user = query.user;

        return this.repository.getAll(filter);
    }

    async getById(id) {
        if (!isValidId(id)) {
            throw new HttpError(400, "El id de la inscripción no es válido");
        }

        const enrollment = await this.repository.getById(id);
        if (!enrollment) {
            throw new HttpError(404, "Inscripción no encontrada");
        }

        return enrollment;
    }

    async create(userId, eventId) {
        if (!isValidId(userId)) {
            throw new HttpError(400, "El id de la jugadora no es válido");
        }

        const user = await this.userRepository.getById(userId);
        if (!user) {
            throw new HttpError(404, "Usuario no encontrado");
        }

        const event = await this.eventService.getById(eventId);

        if (event.status !== "programado") {
            throw new HttpError(409, "El evento no admite inscripciones");
        }

        const yaInscripta = await this.repository.getByUserAndEvent(userId, eventId);
        if (yaInscripta) {
            throw new HttpError(409, "La jugadora ya está inscripta en este evento");
        }

        const inscriptas = await this.repository.countByEvent(eventId);
        if (inscriptas >= event.capacity) {
            throw new HttpError(409, "El evento no tiene cupo disponible");
        }

        return this.repository.create({ user: userId, event: eventId });
    }
}
