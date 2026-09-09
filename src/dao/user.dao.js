import { MongoDao } from "./mongo.dao.js";

export class UserDao extends MongoDao {
    async findByEmail(email) {
        return this.findOne({ email });
    }

    async updateByEmail(email, data) {
        return this.model.findOneAndUpdate({ email }, data, { new: true, runValidators: true }).lean();
    }
}
