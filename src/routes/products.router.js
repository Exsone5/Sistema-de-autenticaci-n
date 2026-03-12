import { Router } from 'express';
import { passportCall, authorization } from '../middlewares/auth.middleware.js';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products.controller.js';

const router = Router();

// Rutas públicas
router.get('/',     getProducts);
router.get('/:pid', getProductById);

// Rutas protegidas - solo admin puede crear, actualizar y eliminar
router.post('/',        passportCall('current'), authorization(['admin']), createProduct);
router.put('/:pid',     passportCall('current'), authorization(['admin']), updateProduct);
router.delete('/:pid',  passportCall('current'), authorization(['admin']), deleteProduct);

export default router;
