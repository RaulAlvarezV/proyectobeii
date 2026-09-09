export class EnrollmentRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll(filter) {
        return this.dao.find(filter);
    }

    async getById(id) {
        return this.dao.findById(id);
    }

    async getByUserAndEvent(userId, eventId) {
        return this.dao.findOne({ user: userId, event: eventId });
    }

    async countByEvent(eventId) {
        const enrollments = await this.dao.find({ event: eventId, status: "confirmada" });
        return enrollments.length;
    }

    async create(data) {
        return this.dao.create(data);
    }
}
