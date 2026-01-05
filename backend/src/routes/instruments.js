const express = require('express');
const router = express.Router();
const InstrumentsController = require('../controllers/InstrumentsController');

/**
 * @swagger
 * /instruments:
 *   get:
 *     summary: Retrieve a list of available instruments
 *     tags: [Instruments]
 *     responses:
 *       200:
 *         description: A list of instruments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   symbol:
 *                     type: string
 *                   exchange:
 *                     type: string
 *                   instrumentType:
 *                     type: string
 *                   lastTradedPrice:
 *                     type: number
 */
router.get('/', InstrumentsController.getInstruments);

module.exports = router;
