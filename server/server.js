//Conf
require('./config/config');

//Node libraries
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');

//Models
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

//Middleware
var {authenticate} = require('./Middleware/authenticate');

//Routes
var userRoutes= require('./routes/user_router');
var todoRoutes= require('./routes/todo_router');



var port = process.env.PORT;
 
var app = express();

app.use(bodyParser.json()); 

//Routes
app.use('/users',userRoutes);
app.use('/todos',todoRoutes);


app.listen(port,()=>{
    console.log(`Starting at port ${port}`);
});

module.exports = {app};

// const main = async ()=>{
//     // const todo = await Todo.findById('5cd3cc5a9f44f12700dc5184');
//     // await todo.populate('_creator').execPopulate();
//     // console.log(todo._creator);

//     const user = await User.findById('5cd3cc1b9f44f12700dc5182');
//     await user.populate('todos').execPopulate();
//     console.log(user.todos);
// }

// main();