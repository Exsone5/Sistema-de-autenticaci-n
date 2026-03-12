import { ProductDAO } from '../dao/product.dao.js';

const productDAO = new ProductDAO();

export class ProductRepository {
    async getAll(query = {}, options = {}) {
        return productDAO.findAll(query, options);
    }

    async getById(id) {
        return productDAO.findById(id);
    }

    async getByCode(code) {
        return productDAO.findByCode(code);
    }

    async create(productData) {
        return productDAO.create(productData);
    }

    async update(id, updateData) {
        return productDAO.update(id, updateData);
    }

    async delete(id) {
        return productDAO.delete(id);
    }
}
