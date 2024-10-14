const { sequelize } = require("../../database/models");
const { QueryTypes } = require("sequelize");
const { logger } = require("../../config/logging.js");

// VALIDATOR
const { make } = require("simple-body-validator");
const { userByEmail } = require("../../validation/index.js");

exports.getUser = async (req, reply) => {
  try {
    let page = req.query.page || 0;
    if (page < 1)
      return reply
        .code(400)
        .send({ status: 400, message: "page must be greater than 0" });

    let limit = req.query.limit || 0;
    if (limit < 1)
      return reply
        .code(400)
        .send({ status: 400, message: "limit must be greater than 0" });

    let sort_by = req.query.sort_by || "id";
    if (sort_by != "id" && sort_by != "name" && sort_by != "email")
      return reply
        .code(400)
        .send({ status: 400, message: "sort by must be id, name or email" });

    var order_by = req.query.order_by || "false";
    var order_by_res = order_by == "false" ? "asc" : "desc";
    if (order_by != "false" && order_by != "true")
      return reply
        .code(400)
        .send({ status: 400, message: "order by must be false or true" });

    let search = req.query.search || "";
    let search_db = search
      ? `WHERE name LIKE '%${search}%' OR email LIKE '%${search}%'`
      : "";
    let offset = (page - 1) * limit;

    let total = await sequelize.query(
      `SELECT count(*) as total FROM users ${search_db}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    let total_page = Math.ceil(total[0].total / limit);

    let data = await sequelize.query(
      `SELECT id, name, email FROM users ${search_db}
              order by ${sort_by} ${order_by_res} limit ${offset},${limit}`,
      { type: QueryTypes.SELECT }
    );

    reply.code(200).send({
      status: 200,
      message: "all users",
      data: {
        rows: data,
        page: page,
        limit: limit,
        total_rows: total[0].total,
        total_page: total_page,
      },
    });
  } catch (err) {
    console.log(err);
    logger.log({ level: "error", label: "Req getUser", message: err });
    reply.code(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.getUserById = async (req, reply) => {
  try {
    const { id } = req.params;
    const user = await sequelize.query(`select * from users where id = ${id}`, {
      type: QueryTypes.SELECT,
    });

    if (user.length <= 0) {
      reply.code(400).send({
        status: 400,
        message: "user not found",
      });
    }

    reply.code(200).send({
      status: 200,
      message: "detail user",
      data: user,
    });
  } catch (err) {
    console.log(err);
    logger.log({ level: "error", label: "Req getUserById", message: err });
    reply.code(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.createUser = async (req, reply) => {
  try {
    const { name, email, password } = req.body;

    // VALIDATOR
    const valReq = {
      name: name,
      email: email,
      password: password,
    };
    const userVal = await userByEmail(email);
    const validator = make(
      valReq,
      {
        name: "required|string|min:3",
        email: [
          "required",
          "string",
          "email",
          function (value, fail, attribute) {
            if (userVal) {
              fail(`The ${attribute} has been registered`);
            }
          },
        ],
        password: "required|string|min:6",
      },
      {
        required: "The :attribute is required.",
        email: "The :attribute is invalid.",
        min: "The :attribute must be at least :min characters.",
      }
    );
    if (!validator.validate()) {
      return reply.code(422).send({
        status: 422,
        message: "validation error",
        errors: validator.errors().all(),
      });
    }

    const res = await sequelize.models.users.create({
      name,
      email,
      password,
    });

    reply.code(201).send({
      status: 201,
      message: "create user successfully",
      data: res,
    });
  } catch (err) {
    console.log(err);
    logger.log({ level: "error", label: "Req createUser", message: err });
    reply.code(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.updateUser = async (req, reply) => {
  try {
    const { name, email_old, email, password } = req.body;

    // VALIDATOR
    const valReq = {
      name: name,
      email: email,
      password: password,
    };
    const userVal = await userByEmail(email);
    const validator = make(
      valReq,
      {
        name: "required|string|min:3",
        email_old: "string|email",
        email: [
          "required",
          "string",
          "email",
          function (value, fail, attribute) {
            if (email !== email_old && userVal) {
              fail(`The ${attribute} has been registered`);
            }
          },
        ],
        password: "required|string|min:6",
      },
      {
        required: "The :attribute is required.",
        email: "The :attribute is invalid.",
        min: "The :attribute must be at least :min characters.",
      }
    );
    if (!validator.validate()) {
      return reply.code(422).send({
        status: 422,
        message: "validation error",
        errors: validator.errors().all(),
      });
    }

    const { id } = req.params;
    const user = await sequelize.query(`select * from users where id = ${id}`, {
      type: QueryTypes.SELECT,
    });
    if (user.length <= 0) {
      reply.code(400).send({
        status: 400,
        message: "user not found",
      });
    }

    await sequelize.models.users.update(
      {
        name: name,
        email: email,
        password: password,
      },
      {
        where: {
          id: id,
        },
      }
    );

    const userUpdated = await sequelize.query(
      `select * from users where id = ${id}`,
      { type: QueryTypes.SELECT }
    );

    reply.code(200).send({
      status: 200,
      message: "update user successfully",
      data: userUpdated,
    });
  } catch (err) {
    console.log(err);
    logger.log({ level: "error", label: "Req updateUser", message: err });
    reply.code(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.deleteUser = async (req, reply) => {
  try {
    const { id } = req.params;
    const user = await sequelize.query(`select * from users where id = ${id}`, {
      type: QueryTypes.SELECT,
    });
    if (user.length <= 0) {
      reply.code(400).send({
        status: 400,
        message: "user not found",
      });
    }

    await sequelize.models.users.destroy({
      where: {
        id: id,
      },
    });

    reply.code(200).send({
      status: 200,
      message: "delete user successfully",
    });
  } catch (err) {
    console.log(err);
    logger.log({ level: "error", label: "Req deteleUser", message: err });
    reply.code(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};
