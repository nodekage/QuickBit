// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '100h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Enable in a production environment with HTTPS
        sameSite: 'None', // Adjust based on your requirements
      });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = (req, res) => {
  res.json({ userId: req.userId });
};
