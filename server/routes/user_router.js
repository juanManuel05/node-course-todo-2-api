var express = require('express');
var router = express.Router();

//require controller modules
var user_controller = require('../controllers/user_controller');


//POST for logining user
router.post('/login',user_controller.user_login);

//POST for new user
router.post('/user',user_controller.new_user);

//GET me
router.get('/me',user_controller.me);

//DELETE token from user
router.delete('/me/token',user_controller.delete_token);

module.exports = router;