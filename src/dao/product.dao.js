import { productModel } from '../models/product.model.js';

export class ProductDAO {
    async findAll(query = {}, options = {}) {
        const { limit = 10, page = 1, sort } = options;
        const skip = (page - 1) * limit;

        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        const [docs, total] = await Promise.all([
            productModel.find(query).sort(sortOption).skip(skip).limit(limit),
            productModel.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);
        return {
            docs,
            totalDocs: total,
            limit,
            totalPages,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
        };
    }

    async findById(id) {
        return productModel.findById(id);
    }

    async findByCode(code) {
        return productModel.findOne({ code });
    }

    async create(productData) {
        return productModel.create(productData);
    }

    async update(id, updateData) {
        return productModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return productModel.findByIdAndDelete(id);
    }
}
