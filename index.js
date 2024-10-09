// IMPORT MODULE
const fastify = require('fastify')({ logger: false })
require('./src/config/database.js')
require('dotenv').config()

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