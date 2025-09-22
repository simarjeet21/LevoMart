import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Product API",
//       version: "1.0.0",
//       description: "API documentation for the Product microservice",
//     },
//   },
//   apis: ["./routes/*.ts"], // or .ts if using TypeScript
// };

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Levomart API Docs",
    version: "1.0.0",
    description: "API documentation for Levomart microservices",
  },
  //   servers: [
  //     {
  //       url: "http://localhost:4000/api", // adjust base URL
  //     },
  //   ],
};

// Swagger options
const options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.ts"], // 👈 Important: match your route file path!
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
