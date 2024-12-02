const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
 
 
 
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-security-answer', authController.verifySecurityAnswer);
router.post('/reset-password', authController.resetPassword);
router.post('/get-security-question',authController.getSecurityQuestion);
 
module.exports = router;