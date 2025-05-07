// filepath: /home/vane/Documents/contas/contas_api/src/index.js
const fastify = require("fastify")({ logger: true });
const Loaders = require("../database");
const routes = require("./routes");
const { jsonSchemaTransform } = require("fastify-type-provider-zod");

require("dotenv").config();

Loaders.start();

// Configuração do CORS
fastify.register(require("@fastify/cors"), { origin: "*" });

// Configuração do Swagger
fastify.register(require("@fastify/swagger"), {
  openapi: {
    info: {
      title: "API de Controle Financeiro",
      description: "API para controle financeiro pessoal",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Servidor local",
      },
    ],
  },
});

// Configuração do Swagger UI
fastify.register(require("@fastify/swagger-ui"), {
  routePrefix: "/docs", // Define o prefixo da rota para acessar a documentação
  uiConfig: {
    docExpansion: "full", // Expande todas as seções por padrão
    deepLinking: false,
  },
  transform: jsonSchemaTransform,
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Registro das rotas
fastify.register(routes);

// Inicialização do servidor
fastify.listen({ port: 3333, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`🚀 Servidor rodando em ${address}`);
});
