const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const SERVER_URL = process.env.SERVER_URL || `http://localhost:3000`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PINT API Documentation',
      version: '1.0.0',
      description: 'API documentation for PINT application',
    },
    servers: [
      {
        url: SERVER_URL,
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
    security: [{
      bearerAuth: []
    }],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
