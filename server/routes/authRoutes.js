const express = require('express');
const { adminLogin, signup } = require('../controllers/authController');
const router = express.Router();

// Admin Login
router.post('/admin/login', adminLogin);

// Client Signup
router.post('/signup', signup);

module.exports = router;
