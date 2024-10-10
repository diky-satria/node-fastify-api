const { sequelize } = require('../database/models');
const { QueryTypes } = require("sequelize");

exports.userByEmail = async (email) => {
    const user = await sequelize.query(`select * from users where email = '${email}'`, { type: QueryTypes.SELECT })
    if(user.length > 0){
        return true
    }
    return false
}