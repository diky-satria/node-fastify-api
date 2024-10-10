const jwt = require('jsonwebtoken')
require('dotenv').config()

const VerifyToken = (req, reply, done) => {
    const getToken = req.headers['authorization'];
    if (!getToken) {
        reply.code(401).send({
            status: 401,
            message: "Unauthorized",
        });
    }

    const token = getToken.split(" ")[1];
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reply.status(401).send({
            status: 401,
            message: "Unauthorized - Invalid token",
        });
      }
      
      req.user = decoded;
      done();
    });
  };
  
  module.exports = VerifyToken;