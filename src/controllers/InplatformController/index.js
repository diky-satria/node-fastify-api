const { logger } = require("../../config/logging.js");
require("dotenv").config();
const axios = require("axios");
const {
  frIndonesiaDate,
  frIndonesiaTimeForId,
} = require("../../helpers/HDate");

// VALIDATOR
const { make } = require("simple-body-validator");
const { userByEmailInplatform } = require("../../validation/index.js");

const db_folder = "users";
const db_filename = "users.json";

exports.getUser = async (req, reply) => {
  try {
    let res = await axios.get(
      `${process.env.URL_INPLATFORM}/${db_folder}/${db_filename}`
    );
    let data = res.data.sort((a, b) => b.id - a.id);
    reply.code(200).send({
      status: 200,
      message: "inplatform all users",
      data: data,
    });
  } catch (err) {
    console.log(err);
    logger.log({
      level: "error",
      label: "Inplatform Req getUser",
      message: err,
    });
    reply.code(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.getUserById = async (req, reply) => {
  try {
    let res = await axios.get(
      `${process.env.URL_INPLATFORM}/${db_folder}/${db_filename}`
    );
    let data = res.data.filter((item) => item.id == req.params.id);
    if (data.length <= 0) {
      reply.code(400).send({
        status: 400,
        message: "user not found",
      });
    }

    reply.code(200).send({
      status: 200,
      message: "inplatform detail user",
      data: data[0],
    });
  } catch (err) {
    console.log(err);
    logger.log({
      level: "error",
      label: "Inplatform Req detailUser",
      message: err,
    });
    reply.code(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.createUser = async (req, reply) => {
  try {
    // BODY
    const { name, email, password } = req.body;

    // VALIDATOR
    const valReq = {
      name: name,
      email: email,
      password: password,
    };
    const userVal = await userByEmailInplatform(email, db_folder, db_filename);
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

    // HIT INPLATFORM
    let id_data = frIndonesiaTimeForId();
    let filename = db_filename;
    let dataReq = {
      id: id_data,
      name,
      email,
      password,
      created_at: frIndonesiaDate(),
      updated_at: frIndonesiaDate(),
    };
    let dataRes = [];

    let res1 = await axios.get(
      `${process.env.URL_INPLATFORM}/${db_folder}/?files`
    );
    if (res1.data.length > 0) {
      let res2 = await axios.get(
        `${process.env.URL_INPLATFORM}/${db_folder}/${filename}`
      );
      dataRes = res2.data.concat(dataReq);
    } else {
      dataRes.push(dataReq);
    }

    let file = JSON.stringify(dataRes);
    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("file", file);
    await axios.post(`${process.env.URL_INPLATFORM}/${db_folder}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // RESPONSE
    reply.code(201).send({
      status: 201,
      message: "inplatform create user successfully",
      data: dataReq,
    });
  } catch (err) {
    console.log(err);
    logger.log({
      level: "error",
      label: "Inplatform Req createUser",
      message: err,
    });
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
    const userVal = await userByEmailInplatform(email, db_folder, db_filename);
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

    // HIT INPLATFORM
    const { id } = req.params;
    let res = await axios.get(
      `${process.env.URL_INPLATFORM}/${db_folder}/${db_filename}`
    );
    let data = res.data.filter((item) => item.id == id);
    if (data.length <= 0) {
      reply.code(400).send({
        status: 400,
        message: "user not found",
      });
    }
    data[0].name = name;
    data[0].email = email;
    data[0].password = password;
    data[0].updated_at = frIndonesiaDate();

    let filename = db_filename;
    let file = JSON.stringify(res.data);
    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("file", file);
    await axios.post(`${process.env.URL_INPLATFORM}/${db_folder}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    reply.code(200).send({
      status: 200,
      message: "Inplatform update user successfully",
      data: data[0],
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
    // HIT INPLATFORM
    let res = await axios.get(
      `${process.env.URL_INPLATFORM}/${db_folder}/${db_filename}`
    );
    let data = res.data.filter((item) => item.id == req.params.id);
    if (data.length <= 0) {
      reply.code(400).send({
        status: 400,
        message: "user not found",
      });
    }

    let filename = db_filename;
    let dataRes = res.data.filter((item) => item.id != req.params.id);

    let file = JSON.stringify(dataRes);
    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("file", file);
    await axios.post(`${process.env.URL_INPLATFORM}/${db_folder}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // RESPONSE
    reply.code(201).send({
      status: 201,
      message: "inplatform delete user successfully",
    });
  } catch (err) {
    console.log(err);
    logger.log({
      level: "error",
      label: "Inplatform Req deteleUser",
      message: err,
    });
    reply.code(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};
