import express from 'express';
import productRouter from './modules/product/product.route.js';
import orderRouter from './modules/orders/order.route.js';

export default function createApp({ postgres, redis } = {}) {
    const app = express();
    app.use(express.json());

    app.get('/health', (req, res) => {
        res.send('Health check OK 3');
    });

    app.get('/ready', async (req, res) => {
        const [postgresCheck, redisCheck] = await Promise.allSettled([
            postgres?.query('SELECT 1'),
            redis?.ping(),
        ]);
        const postgresReady = postgresCheck.status === 'fulfilled' && Boolean(postgresCheck.value);
        const redisReady = redisCheck.status === 'fulfilled' && redisCheck.value === 'PONG';

        res.status(postgresReady && redisReady ? 200 : 503).json({
            postgres: postgresReady ? 'ok' : 'unavailable',
            redis: redisReady ? 'ok' : 'unavailable',
        });
    });

    app.use('/products', productRouter);
    app.use('/orders', orderRouter)

    return app;
}
