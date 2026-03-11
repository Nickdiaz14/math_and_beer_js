const swaggerJSDoc = require('swagger-jsdoc');
const { serve } = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Records',
            version: '1.0.0',
            description: 'API documentation for Records',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
            },
        ]
    },
    apis: ['./routes/*.js'] // Path to the API route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;