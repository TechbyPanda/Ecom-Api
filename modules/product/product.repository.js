import { postgres } from '../../config/db.js';

export async function findProducts() {
    const { rows } = await postgres.query(`
        SELECT id, sku, barcode, title, shelf
        FROM product
        ORDER BY id
    `);
    return rows;
}
