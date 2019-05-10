var express = require('express');
var router = express.Router();

//Middleware
var {authenticate} = require('../Middleware/authenticate');

//require controller modules
var todo_controller = require('../controllers/todo_controller');


//POST for new todo
router.post('/newTodo',authenticate,todo_controller.new_todo);

// //GET todos for an specified user
router.get('/todos',authenticate, todo_controller.get_todos);

// //GET todo for an specified todo_id & user_id
router.get('/:id',authenticate, todo_controller.get_todo_id);

// //DELETE todo
router.delete('/:id',authenticate,todo_controller.delete_todo);

// //PATCH todo
router.patch('/:id',authenticate,todo_controller.patch_todo);



module.exports = router;