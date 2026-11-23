import * as orderRepository from './order.repository.js';

export function listOrders() {
    return orderRepository.findOrders();
}

export function getOrder(id) {
    return orderRepository.findOrderById(id);
}
