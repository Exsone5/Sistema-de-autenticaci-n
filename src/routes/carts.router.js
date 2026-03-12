import { Router } from 'express';
import { passportCall, authorization } from '../middlewares/auth.middleware.js';
import {
    getCartById,
    createCart,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart,
    purchaseCart
} from '../controllers/carts.controller.js';

const router = Router();

// Crear carrito (público, se usa al registrar)
router.post('/', createCart);

// Ver carrito (autenticado)
router.get('/:cid', passportCall('current'), getCartById);

// Modificar carrito - solo usuarios (no admin)
router.post('/:cid/products/:pid',  passportCall('current'), authorization(['user']), addProductToCart);
router.delete('/:cid/products/:pid',passportCall('current'), authorization(['user']), removeProductFromCart);
router.put('/:cid',                 passportCall('current'), authorization(['user']), updateCart);
router.put('/:cid/products/:pid',   passportCall('current'), authorization(['user']), updateProductQuantity);
router.delete('/:cid',              passportCall('current'), authorization(['user']), clearCart);

// Finalizar compra - solo usuarios
router.post('/:cid/purchase',       passportCall('current'), authorization(['user']), purchaseCart);

export default router;
