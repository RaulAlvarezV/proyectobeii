export class MongoDao {
    constructor(model) {
        this.model = model;
    }

    async find(filter = {}) {
        return this.model.find(filter).lean();
    }

    async findOne(filter) {
        return this.model.findOne(filter).lean();
    }

    async findById(id) {
        return this.model.findById(id).lean();
    }

    async create(data) {
        const document = await this.model.create(data);
        return document.toObject();
    }

    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id).lean();
    }
}
