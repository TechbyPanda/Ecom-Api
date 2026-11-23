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

export async function claimOrder(req, res) {
    const userId = req.get('X-User-Id');

    if (!userId) {
        return res.status(400).json({ error: 'X-User-Id is required' });
    }

    const result = await ordersService.claimOrder(req.params.id, userId);

    if (result.type === 'missing') {
        return res.status(404).json({ error: 'Order not found' });
    }

    if (result.type === 'unavailable') {
        return res.status(409).json({ error: 'Order must be paid and open' });
    }

    if (result.type === 'held') {
        return res.status(409).json({
            error: 'Order is already claimed',
            ...result.lock,
        });
    }

    return res.json(result.lock);
}

export async function releaseOrder(req, res) {
    const userId = req.get('X-User-Id');

    if (!userId) {
        return res.status(400).json({ error: 'X-User-Id is required' });
    }

    const released = await ordersService.releaseOrder(req.params.id, userId);

    if (!released) {
        return res.status(409).json({ error: 'You do not hold an active lock on this order' });
    }

    return res.status(204).end();
}
