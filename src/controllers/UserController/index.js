const User = require('../../models/user')

exports.getUser = async (req, reply) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        const searchQuery = search
            ? {
                $or: [
                  { name: { $regex: search, $options: 'i' } },   // Search by name
                  { email: { $regex: search, $options: 'i' } }   // Search by email
                ]
              }
            : {};

          const totalUsers = await User.countDocuments(searchQuery);

          const users = await User.find(searchQuery)
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);    

          const totalPages = Math.ceil(totalUsers / limitInt);

          reply.code(200).send({
            status: 200,
            message: 'all users',
            data: {
                totalUsers,
                totalPages,
                currentPage: pageInt,
                usersPerPage: limitInt,
                users
            }
        })
      } catch (err) {
        console.log(err)
        reply.code(500).send({
            status: 500,
            message: 'Internal server error',
        })
    }
}

exports.getUserById = async (req, reply) => {
    try {
        const {id} = req.params
        const user = await User.findById(id);
        if(!user){
            reply.code(400).send({
                status: 400,
                message: 'user not found'
            })
        }

        reply.code(200).send({
            status: 200,
            message: 'detail user',
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

exports.createUser = async (req, reply) => {
    try {
        const { name, email, password } = req.body

        const newUser = new User({ name, email, password });
        const res = await newUser.save();

        reply.code(201).send({
            status: 201,
            message: 'create user successfully',
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

exports.updateUser = async (req, reply) => {
    try {
        const {name, email, password} = req.body

        const {id} = req.params
        const user = await User.findById(id);
        if(!user){
            reply.code(400).send({
                status: 400,
                message: 'user not found'
            })
        }

        await User.updateOne(
            { _id: id },
            { $set: { name: name, email: email, password: password } 
        });

        const userUpdated = await User.findById(id);
        
        reply.code(200).send({
            status: 200,
            message: 'update user successfully',
            data: userUpdated
        })
    } catch (err) {
        console.log(err)
        reply.code(500).send({
            status: 500,
            message: 'Internal server error',
        })
    }
}

exports.deleteUser = async (req, reply) => {
    try {
        const {id} = req.params
        const user = await User.findById(id);
        if(!user){
            reply.code(400).send({
                status: 400,
                message: 'user not found'
            })
        }

        await User.deleteOne({ _id: id });

        reply.code(200).send({
            status: 200,
            message: 'delete user successfully'
        })
    } catch (err) {
        console.log(err)
        reply.code(500).send({
            status: 500,
            message: 'Internal server error',
        })
    }
}