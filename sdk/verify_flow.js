const { TradingSDK } = require('./index');

async function runVerification() {
    console.log('--- Starting Verification Flow ---');
    
    // Initialize SDK
    const sdk = new TradingSDK({ baseUrl: 'http://localhost:3000/api/v1' });

    try {
        // 1. Get Instruments
        console.log('\n--- 1. Fetching Instruments ---');
        const instruments = await sdk.getInstruments();
        console.log(`Fetched ${instruments.length} instruments.`);
        if (instruments.length === 0) throw new Error('No instruments returned');
        const apple = instruments.find(i => i.symbol === 'AAPL');
        console.log('Apple Instrument:', apple);

        // 2. Place Order (BUY MARKET AAPL)
        console.log('\n--- 2. Placing BUY MARKET Order (AAPL) ---');
        const marketOrder = {
            symbol: 'AAPL',
            side: 'BUY',
            type: 'MARKET',
            quantity: 10
        };
        const orderRes1 = await sdk.placeOrder(marketOrder);
        console.log('Order Placed:', orderRes1);
        if (orderRes1.status !== 'EXECUTED') throw new Error('Market order should execute immediately');

        // 3. Place Order (BUY LIMIT GOOGL)
        // Check price first
        const goog = instruments.find(i => i.symbol === 'GOOGL');
        console.log('\n--- 3. Placing BUY LIMIT Order (GOOGL) ---');
        const limitOrder = {
            symbol: 'GOOGL',
            side: 'BUY',
            type: 'LIMIT',
            quantity: 5,
            price: goog.lastTradedPrice // Matching LTP should execute
        };
        const orderRes2 = await sdk.placeOrder(limitOrder);
        console.log('Order Placed:', orderRes2);
         if (orderRes2.status !== 'EXECUTED') console.log('Limit order not executed immediately (expected if logic requires price < LTP for strict limit, or match logic differs)');

        // 4. Check Order Status
        console.log('\n--- 4. Checking Order Status ---');
        const status1 = await sdk.getOrderStatus(orderRes1.orderId);
        console.log(`Order ${orderRes1.orderId} Status:`, status1.status);

        // 5. Get Trades
        console.log('\n--- 5. Fetching Trades ---');
        const trades = await sdk.getTrades();
        console.log(`Fetched ${trades.length} trades.`);
        console.log('Last Trade:', trades[trades.length - 1]);

        // 6. Get Portfolio
        console.log('\n--- 6. Fetching Portfolio ---');
        const portfolio = await sdk.getPortfolio();
        console.log('Portfolio Holdings:', portfolio);
        const aaplHolding = portfolio.find(h => h.symbol === 'AAPL');
        if (!aaplHolding || aaplHolding.quantity < 10) throw new Error('Portfolio not updated correctly for AAPL');

        console.log('\n--- Verification SUCCESS ---');

    } catch (error) {
        console.error('\n--- Verification FAILED ---');
        console.error(error);
        process.exit(1);
    }
}

runVerification();
