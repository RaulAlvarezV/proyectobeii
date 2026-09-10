//esta clase es la unica que le habla a mongoose. Si algun dia cambio de base,
//toco solo esta capa y los services ni se enteran.
//le paso el modelo por constructor asi me sirve para users, events y enrollments
export class MongoDao {
    constructor(model) {
        this.model = model;
    }

    //el .lean() me devuelve un objeto js comun en vez de un documento de mongoose,
    //que es lo que necesito para pasarselo al repository
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

    //runValidators porque por default el update se saltea las validaciones del schema
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id).lean();
    }
}
