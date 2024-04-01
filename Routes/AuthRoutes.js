const express = require('express')
const router = express.Router();
const {loginFunction, signupFunction, updatePassword} = require('../Controller/UserController')

router.route('/login').post(loginFunction)
router.route('/signup').post(signupFunction)
router.route('/updatePass').patch(updatePassword);

module.exports = router;