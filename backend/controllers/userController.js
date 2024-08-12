const User = require("../models/User");
const jwt = require('jsonwebtoken');
const process = require('process')

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: token, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
};

module.exports = { getAllUsers, loginUser };
