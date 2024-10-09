const { getUser, getUserById, createUser, updateUser, deleteUser } = require('../../controllers/UserController')
const VerifyToken = require('../../middleware/index.js')

const userRouter = (fastify, option, done) => {
    fastify.get('/', { preHandler: [VerifyToken] }, getUser)
    fastify.get('/:id', { preHandler: [VerifyToken] }, getUserById)
    fastify.post('/', { preHandler: [VerifyToken] }, createUser)
    fastify.put('/:id', { preHandler: [VerifyToken] }, updateUser)
    fastify.delete('/:id', { preHandler: [VerifyToken] }, deleteUser)

    done()
}

module.exports = userRouter