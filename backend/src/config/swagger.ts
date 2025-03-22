import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Atom TODO',
      version: '1.0.0',
      description: 'Documentación de la API de Atom TODO',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://atom-c184a.web.app/api' 
          : `http://localhost:${process.env.PORT || 5000}`,
        description: process.env.NODE_ENV === 'production' ? 'Servidor de producción' : 'Servidor de desarrollo',
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
  apis: ['./src/routes/*.ts'], // Rutas donde buscar los comentarios de la documentación
};

export const swaggerSpec = swaggerJsdoc(options); 