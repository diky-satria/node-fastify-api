// IMPORT MODULE
const fastify = require('fastify')({ logger: false })
require('./src/config/database.js')
require('dotenv').config()

// SWAGGER
fastify.register(require('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'Fastify API',
      description: 'API documentation for Fastify',
      version: '1.0.0'
    },
    host: 'localhost:5000', // Adjust according to your environment
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter your Bearer token in the format **Bearer <token>**'
      }
    }
  }
});

// SWAGGER UI SETUP
fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
});

// IMPORT ROUTER
const rootRouter = require('./src/routes/index.js')
const authRouter = require('./src/routes/AuthRouter/index.js')
const userRouter = require('./src/routes/UserRouter/index.js')

// ROUTE REGISTERED
fastify.register(rootRouter, { prefix: '/' })
fastify.register(authRouter, { prefix: '/api/v1/auth' })
fastify.register(userRouter, { prefix: '/api/v1/user' })

// LISTEN
const port = process.env.PORT
fastify.listen({ port: port }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server running on http://localhost:${port}`)
})