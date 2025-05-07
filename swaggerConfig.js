// swaggerConfig.js
module.exports = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentada com Swagger",
      version: "1.0.0",
      description: "Exemplo de API usando Express + Zod + Swagger",
    },
  },
  apis: ["./src/routes/*.js"], // ajuste para o caminho correto das suas rotas
};
