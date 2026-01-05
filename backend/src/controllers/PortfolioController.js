const db = require('../db/MemoryDB');

class PortfolioController {
    static getPortfolio(req, res) {
        try {
            const portfolio = db.getPortfolio();
            res.json(portfolio);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = PortfolioController;
