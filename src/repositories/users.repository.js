//este es el DTO hecho a mano: aca decido que datos del usuario salen de la app.
//el password no sale nunca, ni siquiera hasheado. Tampoco devuelvo __v ni los timestamps
//porque al front no le sirven de nada
function toPublicUser(user) {
    if (!user) return null;

    return {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    };
}

export class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll() {
        const users = await this.dao.find();
        return users.map(toPublicUser);
    }

    async getById(id) {
        return toPublicUser(await this.dao.findById(id));
    }

    async getByEmail(email) {
        return toPublicUser(await this.dao.findByEmail(email));
    }

    async create(data) {
        return toPublicUser(await this.dao.create(data));
    }

    async updateByEmail(email, data) {
        return toPublicUser(await this.dao.updateByEmail(email, data));
    }
}
