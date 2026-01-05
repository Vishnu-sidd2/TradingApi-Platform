const db = require('../db/MemoryDB');

class InstrumentsController {
    static getInstruments(req, res) {
        try {
            const instruments = db.getInstruments();
            res.json(instruments);
        } catch (error) {
            console.error('Error fetching instruments:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = InstrumentsController;
