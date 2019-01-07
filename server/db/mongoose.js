const mongoose = require('mongoose');
//const MONGODB_URI = 'mongodb://nodeTodoApi:nodeTodoApi2020@ds133627.mlab.com:33627/node-todo-api';

mongoose.Promise= global.Promise;
mongoose.connect(process.env.MONGODB_URI); 
//mongoose.connect('mongodb://localhost:27017/TodoApp'); 
module.exports = {mongoose};

