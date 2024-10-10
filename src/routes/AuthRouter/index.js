const { login, register, me } = require('../../controllers/AuthController')
const VerifyToken = require('../../middleware/index.js')
const { SRoot, SLogin, SMe } = require('../../swagger/index.js')

const authRouter = (fastify, option, done) => {
    fastify.post('/login', SLogin, login)
    fastify.post('/register', register)
    fastify.get('/me', { preHandler: [VerifyToken] }, me)

    done()
}

module.exports = authRouter