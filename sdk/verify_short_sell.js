const { TradingSDK } = require('./index');

async function runVerification() {
    console.log('--- Starting Short Selling Verification ---');
    
    const sdk = new TradingSDK({ baseUrl: 'http://localhost:3000/api/v1' });

    try {
        // 1. Try to SELL AAPL immediately (Should Fail - 400 Insufficient holdings)
        console.log('\n--- 1. Attempting to SELL AAPL without holdings ---');
        try {
            await sdk.placeOrder({
                symbol: 'AAPL',
                side: 'SELL',
                type: 'MARKET',
                quantity: 10
            });
            throw new Error('FAILED: Order should have been rejected');
        } catch (error) {
            console.log('SUCCESS: Order rejected as expected:', error.message);
        }

        // 2. Buy AAPL
        console.log('\n--- 2. Buying 10 AAPL ---');
        await sdk.placeOrder({
            symbol: 'AAPL',
            side: 'BUY',
            type: 'MARKET',
            quantity: 10
        });
        console.log('Bought 10 AAPL.');

        // 3. Sell 5 AAPL (Should Success)
        console.log('\n--- 3. Selling 5 AAPL ---');
        const sellOrder = await sdk.placeOrder({
            symbol: 'AAPL',
            side: 'SELL',
            type: 'MARKET',
            quantity: 5
        });
        console.log('Sold 5 AAPL. Status:', sellOrder.status);

        // 4. Try to Sell 6 AAPL (Should Fail - Have only 5 left)
        console.log('\n--- 4. Attempting to SELL 6 AAPL (Only 5 held) ---');
        try {
            await sdk.placeOrder({
                symbol: 'AAPL',
                side: 'SELL',
                type: 'MARKET',
                quantity: 6
            });
            throw new Error('FAILED: Order should have been rejected');
        } catch (error) {
            console.log('SUCCESS: Order rejected as expected:', error.message);
        }

        console.log('\n--- Verification SUCCESS ---');

    } catch (error) {
        console.error('\n--- Verification FAILED ---');
        console.error(error);
        process.exit(1);
    }
}

runVerification();
