var express = require('express');
var router = express.Router();

//require controller modules
var todo_controller = require('../controllers/todo_controller');


//POST for new todo
router.post('/todo',todo_controller.new_todo);

//GET todos for an specified user
router.get('/todos', todo_controller.get_todos);

//GET todo for an specified todo_id & user_id
router.get('/:id', todo_controller.get_todo_id);

//DELETE todo
router.delete('/:id',todo_controller.delete_todo);

//PATCH todo
router.patch('/:id',todo_controller.patch_todo);



module.exports = router;