import { CartDAO } from '../dao/cart.dao.js';

const cartDAO = new CartDAO();

export class CartRepository {
    async getById(id) {
        return cartDAO.findById(id);
    }

    async create() {
        return cartDAO.create();
    }

    async addProduct(cartId, productId, quantity) {
        return cartDAO.addProduct(cartId, productId, quantity);
    }

    async removeProduct(cartId, productId) {
        return cartDAO.removeProduct(cartId, productId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return cartDAO.updateProductQuantity(cartId, productId, quantity);
    }

    async updateCart(cartId, products) {
        return cartDAO.updateCart(cartId, products);
    }

    async clearCart(cartId) {
        return cartDAO.clearCart(cartId);
    }
}
