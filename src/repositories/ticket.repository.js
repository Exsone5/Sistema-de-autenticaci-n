import { TicketDAO } from '../dao/ticket.dao.js';

const ticketDAO = new TicketDAO();

export class TicketRepository {
    async getAll() {
        return ticketDAO.findAll();
    }

    async getById(id) {
        return ticketDAO.findById(id);
    }

    async getByPurchaser(email) {
        return ticketDAO.findByPurchaser(email);
    }

    async create(ticketData) {
        return ticketDAO.create(ticketData);
    }
}
