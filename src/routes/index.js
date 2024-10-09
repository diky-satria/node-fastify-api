const {rootController} = require('./../controllers')

const rootRouter = (fastify, option, done) => {
    fastify.get('/', rootController)

    done()
}

module.exports = rootRouter