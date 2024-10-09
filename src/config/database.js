const mongoose = require('mongoose');
require('dotenv').config()

const db_name = process.env.DB_DATABASE
mongoose.connect(`mongodb://127.0.0.1:27017/${db_name}`)
  .then(() => {
    console.log('Database connected!')

    // // TEST OF DATABASE -------------------------------------------------------------------------------
    // const userSchema = new mongoose.Schema({
    //   name: String,
    //   email: String,
    //   password: String,
    //   created_at: { type: Date, default: Date.now },
    //   updated_at: { type: Date, default: Date.now },
    // });

    // // MODEL
    // const User = mongoose.model('User', userSchema);

    // // CREATE
    // const createUser = async (name, email, password) => {
    //   try {
    //     const newUser = new User({ name, email, password });
    //     const res = await newUser.save();
    //     console.log('User added successfully:', res);
    //   } catch (err) {
    //     console.log('Add user failed:', err);
    //   }
    // };

    // // READ
    // const getUsers = async (page=1, limit=10, search="") => {
    //   try {
    //     // const { page = 1, limit = 10, search = '' } = request.query;

    //     const pageInt = parseInt(page, 10);
    //     const limitInt = parseInt(limit, 10);

    //     const searchQuery = search
    //         ? {
    //             $or: [
    //               { name: { $regex: search, $options: 'i' } },   // Search by name
    //               { email: { $regex: search, $options: 'i' } }   // Search by email
    //             ]
    //           }
    //         : {};

    //       const totalUsers = await User.countDocuments(searchQuery);

    //       const users = await User.find(searchQuery)
    //         .skip((pageInt - 1) * limitInt)
    //         .limit(limitInt);    

    //       const totalPages = Math.ceil(totalUsers / limitInt);

    //       console.log('Users found:', {
    //         totalUsers,
    //         totalPages,
    //         currentPage: pageInt,
    //         usersPerPage: limitInt,
    //         users
    //       });
    //   } catch (err) {
    //     console.log('Error fetching users:', err);
    //   }
    // };

    // // DETAIL USER
    // const getUserById = async (id) => {
    //   try {
    //     const user = await User.findById(id);
    //     if (user) {
    //       console.log('User found:', user);
    //     } else {
    //       console.log('User not found');
    //     }
    //   } catch (err) {
    //     console.log('Error fetching user by ID:', err);
    //   }
    // };

    // // UPDATE
    // const updateUser = async (id, name, email, password) => {
    //   try {
    //     const updatedUser = await User.findByIdAndUpdate(id, { name: name, email: email, password: password }, { new: true });
    //     console.log('User updated successfully:', updatedUser);
    //   } catch (err) {
    //     console.log('Error updating user:', err);
    //   }
    // };

    // // DELETE
    // const deleteUser = async (id) => {
    //   try {
    //     const deletedUser = await User.findByIdAndDelete(id);
    //     console.log('User deleted successfully:', deletedUser);
    //   } catch (err) {
    //     console.log('Error deleting user:', err);
    //   }
    // };

    // // RUNNING
    // (async () => {
    //   // await createUser('danu', 'danu@gmail.com', 'password'); 
    //   // await updateUser('67056d5249a38ef461685ecc', 'diky', 'diky@gmail.com', 'password');
    //   // await getUsers();                          
    //   // await getUserById('670586ec2e91b2518983a86c');                          
    //   // await deleteUser('67056e7937fc9cdf041c6122');         
    // })();

    // // TEST OF DATABASE END -------------------------------------------------------------------------------

  })
  .catch((err) => console.log('Database failed connected!'))