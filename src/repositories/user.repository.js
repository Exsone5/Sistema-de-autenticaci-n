import { UserDAO } from '../dao/user.dao.js';

const userDAO = new UserDAO();

export class UserRepository {
    async getAll() {
        return userDAO.findAll();
    }

    async getById(id) {
        return userDAO.findById(id);
    }

    async getByEmail(email) {
        return userDAO.findByEmail(email);
    }

    async create(userData) {
        return userDAO.create(userData);
    }

    async update(id, updateData) {
        return userDAO.update(id, updateData);
    }

    async delete(id) {
        return userDAO.delete(id);
    }
}
