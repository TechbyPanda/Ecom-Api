import { postgres } from '../../config/db.js';

export async function findOrders() {
    const { rows } = await postgres.query(`
        SELECT id, external_id AS order_number, status, created_at
        FROM orders
        ORDER BY id
    `);

    return rows;
}

export async function findOrderById(id) {
    const { rows: [order] } = await postgres.query(`
        SELECT id, external_id AS order_number, payment_status, status, created_at
        FROM orders
        WHERE id = $1
    `, [id]);

    return order ?? null;
}
