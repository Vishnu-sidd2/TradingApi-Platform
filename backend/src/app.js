const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const logger = require('./utils/logger');
const instrumentsRoutes = require('./routes/instruments');
const ordersRoutes = require('./routes/orders');
const tradesRoutes = require('./routes/trades');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request Logging Middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Trading API',
            version: '1.0.0',
            description: 'Simplified Trading Backend API',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/instruments', instrumentsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/trades', tradesRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
