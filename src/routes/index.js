const { rootController } = require("./../controllers");
const { SHide } = require("../swagger/index.js");

const rootRouter = (fastify, option, done) => {
  fastify.get("/", { schema: SHide }, rootController);

  done();
};

module.exports = rootRouter;
