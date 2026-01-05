const express = require('express');
const router = express.Router();
const TradesController = require('../controllers/TradesController');

/**
 * @swagger
 * /trades:
 *   get:
 *     summary: Get executed trades
 *     tags: [Trades]
 *     responses:
 *       200:
 *         description: List of trades
 */
router.get('/', TradesController.getTrades);

module.exports = router;
