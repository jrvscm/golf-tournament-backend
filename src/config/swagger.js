const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Restaurant Saas API',
            version: '1.0.0',
            description: 'API documentation for the Neighborhood HQ application.',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/swagger/*.swagger.js'], // Point to your Swagger files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
