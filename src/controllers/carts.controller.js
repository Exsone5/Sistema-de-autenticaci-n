import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { sendPurchaseConfirmationEmail } from '../config/mailer.config.js';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

// GET /api/carts/:cid
export const getCartById = async (req, res) => {
    try {
        const cart = await cartRepository.getById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// POST /api/carts
export const createCart = async (req, res) => {
    try {
        const cart = await cartRepository.create();
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// POST /api/carts/:cid/products/:pid  [solo user]
export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        // Verificar que el carrito pertenece al usuario autenticado
        if (req.user.cart?.toString() !== cid) {
            return res.status(403).json({
                status: 'error',
                message: 'No podés modificar un carrito que no es tuyo'
            });
        }

        const product = await productRepository.getById(pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

        const updatedCart = await cartRepository.addProduct(cid, pid, parseInt(quantity));
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// DELETE /api/carts/:cid/products/:pid  [solo user]
export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        if (req.user.cart?.toString() !== cid) {
            return res.status(403).json({ status: 'error', message: 'No podés modificar un carrito que no es tuyo' });
        }

        const updatedCart = await cartRepository.removeProduct(cid, pid);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// PUT /api/carts/:cid  [solo user] - reemplaza todos los productos
export const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        if (req.user.cart?.toString() !== cid) {
            return res.status(403).json({ status: 'error', message: 'No podés modificar un carrito que no es tuyo' });
        }

        const updatedCart = await cartRepository.updateCart(cid, products);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// PUT /api/carts/:cid/products/:pid  [solo user] - actualiza quantity
export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser mayor a 0' });
        }

        if (req.user.cart?.toString() !== cid) {
            return res.status(403).json({ status: 'error', message: 'No podés modificar un carrito que no es tuyo' });
        }

        const updatedCart = await cartRepository.updateProductQuantity(cid, pid, quantity);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// DELETE /api/carts/:cid  [solo user] - vacía el carrito
export const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;

        if (req.user.cart?.toString() !== cid) {
            return res.status(403).json({ status: 'error', message: 'No podés modificar un carrito que no es tuyo' });
        }

        const updatedCart = await cartRepository.clearCart(cid);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

/**
 * POST /api/carts/:cid/purchase  [solo user]
 * 
 * Lógica de compra:
 * 1. Obtiene el carrito con productos populados
 * 2. Verifica stock de cada producto
 * 3. Productos con stock suficiente → procesa, reduce stock, agrega al ticket
 * 4. Productos sin stock → quedan en el carrito
 * 5. Genera ticket con los productos procesados
 * 6. Envía email de confirmación
 */
export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;

        if (req.user.cart?.toString() !== cid) {
            return res.status(403).json({ status: 'error', message: 'No podés comprar desde un carrito que no es tuyo' });
        }

        const cart = await cartRepository.getById(cid);
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ status: 'error', message: 'El carrito está vacío' });
        }

        const processedProducts = [];   // productos que se pudieron comprar
        const failedProducts    = [];   // productos sin stock suficiente
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = await productRepository.getById(item.product._id || item.product);

            if (!product) {
                failedProducts.push(item);
                continue;
            }

            if (product.stock >= item.quantity) {
                // Hay stock → reducir stock y agregar al ticket
                await productRepository.update(product._id, {
                    stock: product.stock - item.quantity
                });

                processedProducts.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price
                });

                totalAmount += product.price * item.quantity;
            } else {
                // Sin stock suficiente → queda en el carrito
                failedProducts.push(item);
            }
        }

        if (processedProducts.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Ningún producto tiene stock suficiente para procesar la compra',
                failedProducts
            });
        }

        // Generar ticket de compra
        const ticket = await ticketRepository.create({
            amount: totalAmount,
            purchaser: req.user.email,
            products: processedProducts
        });

        // Actualizar carrito: solo quedan los productos que no se pudieron comprar
        await cartRepository.updateCart(cid, failedProducts);

        // Enviar email de confirmación (sin bloquear la respuesta si falla)
        sendPurchaseConfirmationEmail(req.user.email, ticket).catch((err) => {
            console.error('⚠️ Error al enviar email de confirmación:', err.message);
        });

        res.json({
            status: 'success',
            message: failedProducts.length > 0
                ? 'Compra procesada parcialmente. Algunos productos no tenían stock suficiente.'
                : 'Compra completada exitosamente',
            ticket,
            failedProducts: failedProducts.length > 0 ? failedProducts : undefined
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
