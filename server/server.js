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
app.use('/users',userRoutes);
app.use('/todos',todoRoutes);


app.listen(port,()=>{
    console.log(`Starting at port ${port}`);
});

module.exports = {app};
