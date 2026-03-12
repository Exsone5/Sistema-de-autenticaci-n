import { ProductRepository } from '../repositories/product.repository.js';

const productRepository = new ProductRepository();

// GET /api/products
export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category, status } = req.query;

        const query = {};
        if (category) query.category = category;
        if (status !== undefined) query.status = status === 'true';

        const result = await productRepository.getAll(query, {
            limit: parseInt(limit),
            page: parseInt(page),
            sort
        });

        res.json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// GET /api/products/:pid
export const getProductById = async (req, res) => {
    try {
        const product = await productRepository.getById(req.params.pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// POST /api/products  [solo admin]
export const createProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            return res.status(400).json({ status: 'error', message: 'Todos los campos obligatorios deben completarse' });
        }

        const existing = await productRepository.getByCode(code);
        if (existing) {
            return res.status(400).json({ status: 'error', message: 'Ya existe un producto con ese código' });
        }

        const product = await productRepository.create({
            title, description, code, price, stock, category,
            thumbnails: thumbnails || []
        });

        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// PUT /api/products/:pid  [solo admin]
export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const updated = await productRepository.update(pid, req.body);
        if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        res.json({ status: 'success', payload: updated });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// DELETE /api/products/:pid  [solo admin]
export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const deleted = await productRepository.delete(pid);
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        res.json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
