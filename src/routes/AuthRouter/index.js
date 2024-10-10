const { login, register, me } = require('../../controllers/AuthController')
const VerifyToken = require('../../middleware/index.js')
const { SHide,SLogin, SMe } = require('../../swagger/index.js')

const authRouter = (fastify, option, done) => {
    fastify.post('/login', SLogin, login)
    fastify.post('/register', { schema: SHide}, register)
    fastify.get('/me', { schema: SMe, preHandler: [VerifyToken] }, me)

    done()
}

module.exports = authRouter