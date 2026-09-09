function toPublicUser(user) {
    if (!user) return null;

    const { password, __v, ...publicUser } = user;
    return publicUser;
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

    async updateByEmail(email, data) {
        return toPublicUser(await this.dao.updateByEmail(email, data));
    }
}
