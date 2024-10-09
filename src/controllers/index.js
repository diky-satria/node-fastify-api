exports.rootController = (req, reply) => {
    reply.code(200).send({
        status: 200,
        message: 'Welcome to API v1 by Fastify'
     })
}