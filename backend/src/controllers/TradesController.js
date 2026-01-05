const db = require('../db/MemoryDB');

class TradesController {
    static getTrades(req, res) {
        try {
            const trades = db.getTrades();
            res.json(trades);
        } catch (error) {
            console.error('Error fetching trades:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = TradesController;
