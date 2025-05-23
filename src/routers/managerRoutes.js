const express=require("express")
const router = new express.Router();
const Controllers = require('../controllers/managerControllers.js')


router.get('/test', (req,res)=>{
    res.send({ response : "Server is running"})
})
router.get('/getUsers', Controllers.getUsers);
router.get('/station-revenue', Controllers.stationRevenue)

router.post('/login', Controllers.login) ; // Login
router.post('/register', Controllers.register); // Register



module.exports = router