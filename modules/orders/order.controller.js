import * as ordersService from './order.service.js';

export async function listOrders(req, res) {
    const result = await ordersService.listOrders();
    res.status(200).json(result);
}

export async function getOrder(req, res) {
    const order = await ordersService.getOrder(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(order);
}

