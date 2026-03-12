import { cartModel } from '../models/cart.model.js';

export class CartDAO {
    async findById(id) {
        return cartModel.findById(id).populate('products.product');
    }

    async create() {
        return cartModel.create({ products: [] });
    }

    async addProduct(cartId, productId, quantity = 1) {
        const cart = await cartModel.findById(cartId);
        if (!cart) return null;

        const existingItem = cart.products.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return cart.save();
    }

    async removeProduct(cartId, productId) {
        return cartModel.findByIdAndUpdate(
            cartId,
            { $pull: { products: { product: productId } } },
            { new: true }
        );
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return cartModel.findOneAndUpdate(
            { _id: cartId, 'products.product': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );
    }

    async updateCart(cartId, products) {
        return cartModel.findByIdAndUpdate(
            cartId,
            { products },
            { new: true }
        );
    }

    async clearCart(cartId) {
        return cartModel.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );
    }
}
