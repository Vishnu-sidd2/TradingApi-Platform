class MemoryDB {
    constructor() {
        if (MemoryDB.instance) {
            return MemoryDB.instance;
        }

        this.instruments = [
            { symbol: 'AAPL', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 150.00 },
            { symbol: 'GOOGL', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 2800.00 },
            { symbol: 'TSLA', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 700.00 },
            { symbol: 'AMZN', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 3300.00 },
            { symbol: 'MSFT', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 290.00 },
            { symbol: 'BTC-USD', exchange: 'CRYPTO', instrumentType: 'CRYPTO', lastTradedPrice: 45000.00 },
            { symbol: 'META', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 350.00 },
            { symbol: 'NFLX', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 600.00 },
            { symbol: 'NVDA', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 220.00 },
            { symbol: 'AMD', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 110.00 },
            { symbol: 'INTC', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 50.00 },
            { symbol: 'JPM', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 160.00 },
            { symbol: 'V', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 230.00 },
            { symbol: 'JNJ', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 170.00 },
            { symbol: 'WMT', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 140.00 },
            { symbol: 'PG', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 145.00 },
            { symbol: 'XOM', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 60.00 },
            { symbol: 'DIS', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 155.00 },
            { symbol: 'KO', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 55.00 },
            { symbol: 'PEP', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 150.00 },
            { symbol: 'CSCO', exchange: 'NASDAQ', instrumentType: 'EQUITY', lastTradedPrice: 55.00 },
            { symbol: 'ORCL', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 90.00 },
            { symbol: 'IBM', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 140.00 },
            { symbol: 'CRM', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 250.00 },
            { symbol: 'PFE', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 45.00 },
            { symbol: 'MRK', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 80.00 },
            { symbol: 'T', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 25.00 },
            { symbol: 'VZ', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 55.00 },
            { symbol: 'NKE', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 165.00 },
            { symbol: 'BA', exchange: 'NYSE', instrumentType: 'EQUITY', lastTradedPrice: 220.00 },
            { symbol: 'ETH-USD', exchange: 'CRYPTO', instrumentType: 'CRYPTO', lastTradedPrice: 3000.00 },
            { symbol: 'SOL-USD', exchange: 'CRYPTO', instrumentType: 'CRYPTO', lastTradedPrice: 100.00 },
            { symbol: 'ADA-USD', exchange: 'CRYPTO', instrumentType: 'CRYPTO', lastTradedPrice: 2.00 }
        ];

        // Map<orderId, Order>
        this.orders = new Map();
        
        // Array<Trade>
        this.trades = [];

        // Simple Portfolio: Map<symbol, { quantity, averagePrice }>
        // We assume a single user for simplicity as per requirements
        this.portfolio = new Map();

        MemoryDB.instance = this;
    }

    getInstruments() {
        return this.instruments;
    }

    addOrder(order) {
        this.orders.set(order.orderId, order);
        return order;
    }

    getHolding(symbol) {
        return this.portfolio.get(symbol);
    }

    getOrder(orderId) {
        return this.orders.get(orderId);
    }

    updateOrder(orderId, updates) {
        const order = this.orders.get(orderId);
        if (order) {
            Object.assign(order, updates);
            return order;
        }
        return null;
    }

    addTrade(trade) {
        this.trades.push(trade);
    }

    getTrades() {
        return this.trades;
    }

    updatePortfolio(symbol, quantity, price, side) {
        let holding = this.portfolio.get(symbol);

        if (!holding) {
            holding = { symbol, quantity: 0, averagePrice: 0 };
        }

        if (side === 'BUY') {
            const totalCost = (holding.quantity * holding.averagePrice) + (quantity * price);
            const totalQty = holding.quantity + quantity;
            holding.averagePrice = totalQty > 0 ? totalCost / totalQty : 0;
            holding.quantity = totalQty;
        } else if (side === 'SELL') {
            holding.quantity -= quantity;
        }

        if (holding.quantity <= 0) {
            this.portfolio.delete(symbol);
        } else {
            this.portfolio.set(symbol, holding);
        }
    }

    getPortfolio() {
       
        return Array.from(this.portfolio.values()).map(holding => {
            const instrument = this.instruments.find(i => i.symbol === holding.symbol);
            const currentPrice = instrument ? instrument.lastTradedPrice : 0;
            return {
                ...holding,
                currentValue: holding.quantity * currentPrice
            };
        });
    }
}

module.exports = new MemoryDB();
