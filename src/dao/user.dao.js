import { userModel } from '../models/user.model.js';

export class UserDAO {
    async findAll() {
        return userModel.find();
    }

    async findById(id) {
        return userModel.findById(id);
    }

    async findByEmail(email) {
        return userModel.findOne({ email });
    }

    async create(userData) {
        return userModel.create(userData);
    }

    async update(id, updateData) {
        return userModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return userModel.findByIdAndDelete(id);
    }
}
