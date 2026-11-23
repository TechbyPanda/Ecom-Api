import * as orderRepository from './order.repository.js';

export function listOrders() {
    return orderRepository.findOrders();
}

export function getOrder(id) {
    return orderRepository.findOrderById(id);
}

export function claimOrder(id, userId) {
    const ttlSeconds = Number(process.env.PICK_LOCK_TTL_SECONDS ?? 900); // Time to Live
    return orderRepository.claimOrder(id, userId, ttlSeconds);
}

export function releaseOrder(id, userId) {
    return orderRepository.releaseOrder(id, userId);
}