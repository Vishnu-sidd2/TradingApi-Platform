const db = require('../db/MemoryDB');
const { v4: uuidv4 } = require('uuid');

class OrdersController {
    static placeOrder(req, res) {
        try {
            const { symbol, side, type, quantity, price } = req.body;
            
            // Basic Validation
            if (!symbol || !side || !type || !quantity) {
                return res.status(400).json({ error: 'Missing mandatory fields' });
            }
            if (quantity <= 0) {
                return res.status(400).json({ error: 'Quantity must be greater than 0' });
            }
            if (type === 'LIMIT' && !price) {
                return res.status(400).json({ error: 'Price is mandatory for LIMIT orders' });
            }

            const instrument = db.getInstruments().find(i => i.symbol === symbol);
            if (!instrument) {
                return res.status(404).json({ error: 'Instrument not found' });
            }

            // Block Short Selling logic
            if (side === 'SELL') {
                const holding = db.getHolding(symbol);
                const currentQty = holding ? holding.quantity : 0;
                if (currentQty < quantity) {
                    return res.status(400).json({ error: `Insufficient holdings. Current quantity: ${currentQty}` });
                }
            }

            const orderId = uuidv4();
            const order = {
                orderId,
                symbol,
                side,
                type,
                quantity,
                price: price || null,
                status: 'NEW',
                timestamp: new Date().toISOString()
            };

            db.addOrder(order);

            // Simulation Logic
            let executed = false;
            let executionPrice = 0;

            if (type === 'MARKET') {
                executed = true;
                executionPrice = instrument.lastTradedPrice;
            } else if (type === 'LIMIT') {
                if (side === 'BUY' && price >= instrument.lastTradedPrice) {
                    executed = true;
                    executionPrice = price; // Or instrument.lastTradedPrice? Simplified to limit price or market price. Let's say we get filled at limit price for simplicity or LTP. Let's use LTP for realism if better, but requirements say "simplified". Let's use LTP if it satisfies limit, otherwise Limit Price.
                    executionPrice = instrument.lastTradedPrice <= price ? instrument.lastTradedPrice : price; 
                } else if (side === 'SELL' && price <= instrument.lastTradedPrice) {
                    executed = true;
                    executionPrice = instrument.lastTradedPrice >= price ? instrument.lastTradedPrice : price;
                }
            }

            if (executed) {
                order.status = 'EXECUTED';
                order.executionPrice = executionPrice;
                order.executionTime = new Date().toISOString();

                // Create Trade
                const trade = {
                    tradeId: uuidv4(),
                    orderId: order.orderId,
                    symbol: order.symbol,
                    side: order.side,
                    quantity: order.quantity,
                    price: executionPrice,
                    timestamp: new Date().toISOString()
                };
                db.addTrade(trade);

                // Update Portfolio
                db.updatePortfolio(symbol, quantity, executionPrice, side);
            } else {
                order.status = 'PLACED';
            }

            res.status(201).json(order);

        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static getOrder(req, res) {
        try {
            const { orderId } = req.params;
            const order = db.getOrder(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = OrdersController;
