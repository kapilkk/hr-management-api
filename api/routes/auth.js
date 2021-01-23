const express = require('express');
const router = express.Router();
const { signin, signout } = require('../controllers/auth');
const { check } = require('express-validator');


//route to signin
router.post("/signin", [
    check('email', 'email is required').isLength({ min: 1 }),
    check('password', 'password is required').isLength({ min: 1 })
], signin);


//route to signout
router.get("/signout", signout);


module.exports = router; 