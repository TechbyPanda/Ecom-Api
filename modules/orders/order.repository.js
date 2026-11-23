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
        SELECT id, external_id AS order_number, payment_status, status, created_at, locked_until
        FROM orders
        WHERE id = $1
    `, [id]);

    return order ?? null;
}

async function updateClaim(client, id, userId, ttlSeconds) {
    const { rows } = await client.query(`
        UPDATE orders
        SET locked_by = $2,
            locked_until = clock_timestamp() + $3 * interval '1 second'
        WHERE id = $1
          AND payment_status = 'PAID'
          AND status = 'OPEN'
          AND (
              locked_until IS NULL
              OR locked_until <= clock_timestamp()
              OR locked_by = $2
          )
        RETURNING locked_by AS "heldBy", locked_until AS "lockedUntil"
    `, [id, userId, ttlSeconds]);

    return rows[0] ?? null;
}

export async function claimOrder(id, userId, ttlSeconds) {
    const client = await postgres.connect();

    try {
        await client.query('BEGIN');

        const { rows: [order] } = await client.query(`
            SELECT payment_status, status,
                   locked_by AS "heldBy", locked_until AS "lockedUntil"
            FROM orders
            WHERE id = $1
            FOR UPDATE
        `, [id]);

        let result;

        if (!order) {
            result = { type: 'missing' };
        } else if (order.payment_status !== 'PAID' || order.status !== 'OPEN') {
            result = { type: 'unavailable' };
        } else {
            const lock = await updateClaim(client, id, userId, ttlSeconds);
            result = lock
                ? { type: 'claimed', lock }
                : {
                    type: 'held',
                    lock: { heldBy: order.heldBy, lockedUntil: order.lockedUntil },
                };
        }

        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function releaseOrder(id, userId) {
    const { rowCount } = await postgres.query(`
        UPDATE orders
        SET locked_by = NULL, locked_until = NULL
        WHERE id = $1
          AND locked_by = $2
          AND locked_until > clock_timestamp()
    `, [id, userId]);

    return rowCount === 1;
}
