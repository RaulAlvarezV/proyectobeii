import { MongoDao } from "./mongo.dao.js";

//el usuario lo busco por email y no por id, asi que le agrego esos dos metodos
//al CRUD generico en vez de repetirlo entero
export class UserDao extends MongoDao {
    async findByEmail(email) {
        return this.findOne({ email });
    }

    async updateByEmail(email, data) {
        return this.model.findOneAndUpdate({ email }, data, { new: true, runValidators: true }).lean();
    }
}
