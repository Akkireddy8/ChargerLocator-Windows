const express=require("express")
const router = new express.Router()

const path = require('path');
const Controllers = require('../controllers/userControllers.js');
const auth = require('../middlewares/auth.js')


router.get('/test', auth, (req,res)=>{
    res.send({ response : "Server is running"})
})


router.post('/login', Controllers.login)  // Login
router.post('/register', Controllers.register) // Register
router.post('/request-reset-password/:role', Controllers.resetPassword); // Request Reset Password

router.put('/reset-password/', Controllers.confirmResetPassword) // update new password

module.exports = router