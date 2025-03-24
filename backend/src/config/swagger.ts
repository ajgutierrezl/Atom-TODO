import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Atom TODO API',
      version: '1.0.0',
      description: 'Documentation for Atom TODO API',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://atom-c184a.web.app/api' 
          : `http://localhost:${process.env.SERVER_PORT || 5000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
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
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.ts'], // Routes where to look for documentation comments
};

export const swaggerSpec = swaggerJsdoc(options); 