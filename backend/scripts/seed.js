const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = await User.findOne({ isAdmin: true });
    const client = await User.findOne({ isAdmin: false });

    if (!client) {      
      await User.create({
        email: 'client@example.com',
        password: 'client1234',
        isAdmin: false
      });
      console.log('Client user created');
    } else {
      console.log('Client user already exists');
    }

    if (!admin) {
      await User.create({
        email: 'admin@example.com',
        password: 'admin1234',
        isAdmin: true
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
}

seedUsers();
