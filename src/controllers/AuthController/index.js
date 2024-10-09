const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
require('dotenv').config()

exports.login = async (req, reply) => {
    try {
        const { email, password } = req.body;

        // CHECK USER BASE ON EMAIL
        const user = await User.findOne({ email: email });
        console.log('user ', user)

        if (user) {
            const pass_bcrypt = await bcrypt.compare(password, user.password);

            if (pass_bcrypt) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1hr"});

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
        reply.code(500).send({
            status: 500,
            message: 'Internal server error',
        })
    }
}

exports.me = async (req, reply) => {
    try {
        const id = req.user.id
        const user = await User.findById(id).select('-password');

        reply.code(200).send({
            status: 200,
            message: 'user logged in detail',
            data: user
        })
    } catch (err) {
        console.log(err)
        reply.code(500).send({
            status: 500,
            message: 'Internal server error',
        })
    }
}

exports.register = async (req, reply) => {
    try {
        const { name, email, password } = req.body;

        const encrypt_password = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: encrypt_password });
        const res = await newUser.save();

        reply.code(200).send({
            status: 200,
            message: 'register successfully',
            data: res
        })
    } catch (err) {
        console.log(err)
        reply.code(500).send({
            status: 500,
            message: 'Internal server error',
        })
    }
}

