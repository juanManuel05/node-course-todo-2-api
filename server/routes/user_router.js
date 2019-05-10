var express = require('express');
var router = express.Router();

//require controller modules
var user_controller = require('../controllers/user_controller');

//Middleware
var {authenticate} = require('../Middleware/authenticate');


//POST for logining user
router.post('/login',user_controller.user_login);

//POST for new user
router.post('/newUser',user_controller.new_user);

//GET me
router.get('/me',authenticate,user_controller.me);

// //DELETE Log out user
router.delete('/me/token',authenticate,user_controller.delete_token);

// //DELETE user
router.delete('/me',authenticate,user_controller.delete_user);

module.exports = router;