import { Router } from 'express';
import { getOrder, listOrders, claimOrder, releaseOrder } from './order.controller.js';

const router = Router();

router.get('/', listOrders);
router.get('/:id', getOrder);
router.post('/:id/claim', claimOrder);
router.post('/:id/release', releaseOrder);

export default router;
