const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assume User model is used

const adminCredentials = {
  username: 'optiview', // Admin name
  password: 'Optiview6789', // Replace with your desired admin password
};

// Admin Login Logic
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Request received:', { username, password }); // Log the incoming request

    // Check if provided credentials match hardcoded admin credentials
    if (username === adminCredentials.username && password === adminCredentials.password) {
      const token = jwt.sign({ username, role: 'admin' }, process.env.SECRET_KEY, {
        expiresIn: '1d',
      });
      console.log('Admin login successful');
      return res.json({ token, role: 'admin' });
    }

    console.log('Invalid credentials:', { username, password });
    return res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    console.error('Error during login:', error.message); // Log the error
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Client Signup Logic
exports.signup = async (req, res) => {
  const { name, password } = req.body;

  const existingUser = await User.findOne({ name });
  if (existingUser) {
    return res.status(400).json({ message: 'Name already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    password: hashedPassword,
    role: 'client', // Automatically assign the client role
  });

  await user.save();
  res.status(201).json({ message: 'Client registered successfully' });
};
