// IMPORT MODULE
const fastify = require("fastify")({ logger: false });
const cors = require("@fastify/cors");
require("./src/config/database.js");
require("dotenv").config();

// SWAGGER
fastify.register(require("@fastify/swagger"), {
  swagger: {
    info: {
      title: "Fastify API",
      description: "API documentation for Fastify",
      version: "1.0.0",
    },
    host: process.env.SWAGGER_HOST, // Adjust according to your environment
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      BearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description:
          "Enter your Bearer token in the format **Bearer &lt;token&gt;**",
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  exposeRoute: false,
});

// SWAGGER UI SETUP
fastify.register(require("@fastify/swagger-ui"), {
  routePrefix: "/api/documentation",
  uiConfig: {
    docExpansion: "none",
    deepLinking: false,
  },
  staticCSP: true,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
  rootRouter: require("./src/routes/index.js"),
});

// CORS
fastify.register(cors, {
  origin: [process.env.URL_CLIENT],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// IMPORT ROUTER
const rootRouter = require("./src/routes/index.js");
const authRouter = require("./src/routes/AuthRouter/index.js");
const userRouter = require("./src/routes/UserRouter/index.js");
const inplatformRouter = require("./src/routes/InplatformRouter/index.js");

// ROUTE REGISTERED
fastify.register(rootRouter, { prefix: "/" });
fastify.register(authRouter, { prefix: "/api/v1/auth" });
fastify.register(userRouter, { prefix: "/api/v1/user" });
fastify.register(inplatformRouter, { prefix: "/api/v1/inplatform" });

// LISTEN
const port = process.env.PORT;
fastify.listen({ port: port }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${port}`);
});
