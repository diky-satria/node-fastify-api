const { sequelize } = require('../../database/models');
const { QueryTypes } = require("sequelize");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {logger} = require('../../config/logging.js')

// VALIDATOR
const { make } = require('simple-body-validator');
const { userByEmail } = require('../../validation/index.js');

require('dotenv').config()

exports.login = async (req, reply) => {
    try {
        const { email, password } = req.body;

        // VALIDATOR
        const valReq = {
            email: email,
            password: password
        };
        const userVal = await userByEmail(email);
        const validator = make(valReq, {
            'email': [
                'required',
                'string',
                'email',
                function (value, fail, attribute) {
                    if (!userVal) {
                        fail(`The ${attribute} is not registered`);
                    }
                }
            ],
            'password': 'required|string|min:6'
        },{
            'required': 'The :attribute is required.',
            'email': 'The :attribute is invalid.',
            'min': 'The :attribute must be at least :min characters.'
        });
        if (!validator.validate()) {
            return reply.code(422).send({
                status: 422,
                message: 'validation error',
                errors: validator.errors().all(),
            });
        }

        // CHECK USER BASE ON EMAIL
        const user = await sequelize.query(`select * from users where email = '${email}'`, { type: QueryTypes.SELECT })

        if (user.length > 0) {
            const pass_bcrypt = await bcrypt.compare(password, user[0].password);

            if (pass_bcrypt) {
                const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "1hr"});

                reply.code(200).send({
                    status: 200,
                    message: 'success login',
                    token: token
                })
            } else {
                reply.code(422).send({
                    status: 422,
                    message: 'Email or Password is wrong',
                })
            }
        }else{
            reply.code(422).send({
                status: 400,
                message: 'Email is not registered',
            })
        }
        
    } catch (err) {
        console.log(err)
        logger.log({ level: "error", label: "Req login", message: err });
        reply.code(500).send({
            status: 500,
            message: 'Internal server error',
        })
    }
}

exports.me = async (req, reply) => {
    try {
        const id = req.user.id
        const user = await sequelize.query(`select id, name, email, createdAt, updatedAt from users where id = ${id}`, { type: QueryTypes.SELECT })

        reply.code(200).send({
            status: 200,
            message: 'user logged in detail',
            data: user
        })
    } catch (err) {
        console.log(err)
        logger.log({ level: "error", label: "Req me", message: err });
        reply.code(500).send({
            status: 500,
            message: 'Internal server error',
        })
    }
}

exports.register = async (req, reply) => {
    try {
        const { name, email, password } = req.body;

        // VALIDATOR
        const valReq = {
            name: name,
            email: email,
            password: password
        };
        const userVal = await userByEmail(email);
        const validator = make(valReq, {
            'name': 'required|string|min:3',
            'email': [
                'required',
                'string',
                'email',
                function (value, fail, attribute) {
                    if (userVal) {
                        fail(`The ${attribute} has been registered`);
                    }
                }
            ],
            'password': 'required|string|min:6'
        },{
            'required': 'The :attribute is required.',
            'email': 'The :attribute is invalid.',
            'min': 'The :attribute must be at least :min characters.'
        });
        if (!validator.validate()) {
            return reply.code(422).send({
                status: 422,
                message: 'validation error',
                errors: validator.errors().all(),
            });
        }

        // INSERT TO DB
        const encrypt_password = await bcrypt.hash(password, 10);
        const newUser = await sequelize.models.users.create({
            name, 
            email, 
            password: encrypt_password
        })

        reply.code(200).send({
            status: 200,
            message: 'register successfully',
            data: newUser
        })
    } catch (err) {
        console.log(err)
        logger.log({ level: "error", label: "Req register", message: err });
        reply.code(500).send({
            status: 500,
            message: 'Internal server error',
        })
    }
}

