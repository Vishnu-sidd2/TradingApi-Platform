const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/OrdersController');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - side
 *               - type
 *               - quantity
 *             properties:
 *               symbol:
 *                 type: string
 *               side:
 *                 type: string
 *                 enum: [BUY, SELL]
 *               type:
 *                 type: string
 *                 enum: [MARKET, LIMIT]
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Validation error
 */
router.post('/', OrdersController.placeOrder);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:orderId', OrdersController.getOrder);

module.exports = router;
