const express = require('express');
const { adminLogin, signup, clientLogin } = require('../controllers/authController');
const router = express.Router();

// Admin Login
router.post('/admin/login', adminLogin);

// Client Signup
router.post('/signup', signup);

router.post('/login', clientLogin);

module.exports = router;
