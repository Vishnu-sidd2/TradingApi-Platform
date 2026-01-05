const express = require('express');
const router = express.Router();
const PortfolioController = require('../controllers/PortfolioController');

/**
 * @swagger
 * /portfolio:
 *   get:
 *     summary: Get portfolio holdings
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Current portfolio
 */
router.get('/', PortfolioController.getPortfolio);

module.exports = router;
