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

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'client',
    });

    await user.save();
    res.status(201).json({ message: 'Client registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.clientLogin = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


