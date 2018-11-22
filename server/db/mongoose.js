const mongoose = require('mongoose');

mongoose.Promise= global.Promise;
mongoose.connect('mongodb://juanManuel2020:mistral2020@ds121341.mlab.com:21341/node-todo-api');

module.exports = {mongoose};