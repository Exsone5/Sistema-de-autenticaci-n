import { ticketModel } from '../models/ticket.model.js';

export class TicketDAO {
    async findAll() {
        return ticketModel.find().populate('products.product');
    }

    async findById(id) {
        return ticketModel.findById(id).populate('products.product');
    }

    async findByPurchaser(email) {
        return ticketModel.find({ purchaser: email }).populate('products.product');
    }

    async create(ticketData) {
        return ticketModel.create(ticketData);
    }
}
