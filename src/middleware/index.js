const jwt = require('jsonwebtoken')
require('dotenv').config()

const VerifyToken = (request, reply, done) => {
    const getToken = request.headers['authorization'];
    if (!getToken) {
        return reply.code(401).send({
            status: 401,
            message: "Unauthorized",
        });
    }

    const token = getToken.split(" ")[1];
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reply.status(401).send({
            status: 401,
            message: "Unauthorized - Invalid token",
        });
      }
      
      request.user = decoded;
      done();
    });
  };
  
  module.exports = VerifyToken;