const axios = require('axios');

class TradingSDK {
    constructor(config) {
        this.baseUrl = config.baseUrl || 'http://localhost:3000/api/v1';
        this.apiKey = config.apiKey || ''; // Placeholder for now
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${this.apiKey}`
            }
        });
    }

    async getInstruments() {
        try {
            const response = await this.client.get('/instruments');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async placeOrder(order) {
        try {
            const response = await this.client.post('/orders', order);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getOrderStatus(orderId) {
        try {
            const response = await this.client.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }
    



    async getTrades() {
        try {
            const response = await this.client.get('/trades');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getPortfolio() {
        try {
            const response = await this.client.get('/portfolio');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            throw new Error(`API Error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            // No response received
            throw new Error('Network Error: No response received from server');
        } else {
            // Request setup error
            throw new Error(`Client Error: ${error.message}`);
        }
    }
}

module.exports = TradingSDK;
