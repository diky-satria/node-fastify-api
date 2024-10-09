const { login, register, me } = require('../../controllers/AuthController')
const VerifyToken = require('../../middleware/index.js')

const authRouter = (fastify, option, done) => {
    fastify.post('/login', login)
    fastify.post('/register', register)
    fastify.get('/me', { preHandler: [VerifyToken] }, me)

    done()
}

module.exports = authRouter