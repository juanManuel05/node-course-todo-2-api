const mongoose = require('mongoose');
//const MONGODB_URI = 'mongodb://nodeTodoApi:nodeTodoApi2020@ds133627.mlab.com:33627/node-todo-api';

mongoose.Promise= global.Promise;
mongoose.connect(process.env.MONGODB_URI); 
module.exports = {mongoose};

