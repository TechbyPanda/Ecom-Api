import createApp from './app.js';
import { postgres, redis } from './config/db.js';

const port = process.env.PORT || 3000;
redis.connect().catch((error) => console.error('Redis startup error', error.message));

createApp({ postgres, redis }).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
