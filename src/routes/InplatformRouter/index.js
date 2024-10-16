const {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/InplatformController");
const VerifyToken = require("../../middleware/index.js");
const {
  SHide,
  SGetUsersInplatform,
  SGetUserByIdInplatform,
  SCreateUserInplatform,
  SUpdateUserInplatform,
  SDeleteUserInplatform,
} = require("../../swagger/index.js");

const inplatformRouter = (fastify, option, done) => {
  fastify.get(
    "/",
    { schema: SGetUsersInplatform, preHandler: [VerifyToken] },
    getUser
  );
  fastify.get(
    "/:id",
    { schema: SGetUserByIdInplatform, preHandler: [VerifyToken] },
    getUserById
  );
  fastify.post(
    "/",
    { schema: SCreateUserInplatform, preHandler: [VerifyToken] },
    createUser
  );
  fastify.post(
    "/update/:id",
    { schema: SUpdateUserInplatform, preHandler: [VerifyToken] },
    updateUser
  );
  fastify.post(
    "/delete/:id",
    { schema: SDeleteUserInplatform, preHandler: [VerifyToken] },
    deleteUser
  );

  done();
};

module.exports = inplatformRouter;
