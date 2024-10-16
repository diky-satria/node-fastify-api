const { sequelize } = require("../database/models");
const { QueryTypes } = require("sequelize");
const { logger } = require("../config/logging.js");
const axios = require("axios");
require("dotenv").config();

exports.userByEmail = async (email) => {
  const user = await sequelize.query(
    `select * from users where email = '${email}'`,
    { type: QueryTypes.SELECT }
  );
  if (user.length > 0) {
    return true;
  }
  return false;
};

exports.userByEmailInplatform = async (email, db_folder, db_filename) => {
  try {
    let res = await axios.get(
      `${process.env.URL_INPLATFORM}/${db_folder}/${db_filename}`
    );
    let data = res.data.filter((item) => item.email == email);
    return data.length > 0 ? true : false;
  } catch (err) {
    console.log(err);
    logger.log({
      level: "error",
      label: "Inplatform Req checkUserByEmail",
      message: err,
    });
  }
};
