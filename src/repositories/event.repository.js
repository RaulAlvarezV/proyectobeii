export class EventRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll(filter) {
        return this.dao.find(filter);
    }

    async getById(id) {
        return this.dao.findById(id);
    }

    async create(data) {
        return this.dao.create(data);
    }

    async update(id, data) {
        return this.dao.update(id, data);
    }

    async delete(id) {
        return this.dao.delete(id);
    }
}
