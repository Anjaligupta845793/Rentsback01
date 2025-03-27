const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RentsBack API",
      version: "1.0.0",
      description: "API documentation for RentsBack backend",
    },
    servers: [
      {
        url: "http://localhost:5000", // Update this to match your deployment URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Adjust the path to match where your route files are located
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };
