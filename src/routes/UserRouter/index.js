const { getUser, getUserById, createUser, updateUser, deleteUser } = require('../../controllers/UserController')
const VerifyToken = require('../../middleware/index.js')
const { SHide, SGetUsers, SGetUserById, SCreateUser, SUpdateUser, SDeleteUser } = require('../../swagger/index.js')

const userRouter = (fastify, option, done) => {
    fastify.get('/', { schema: SGetUsers, preHandler: [VerifyToken] }, getUser)
    fastify.get('/:id', { schema: SGetUserById, preHandler: [VerifyToken] }, getUserById)
    fastify.post('/', { schema: SCreateUser, preHandler: [VerifyToken] }, createUser)
    fastify.put('/:id', { schema: SUpdateUser, preHandler: [VerifyToken] }, updateUser)
    fastify.delete('/:id', { schema: SDeleteUser, preHandler: [VerifyToken] }, deleteUser)

    done()
}

module.exports = userRouter