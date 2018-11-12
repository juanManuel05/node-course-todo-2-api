var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
 
var app = express();

app.use(bodyParser.json()); 

app.post('/todos',(req,res)=>{
    var todo = new Todo ({
        text: req.body.text
    });

    todo.save().then((doc)=>{
            res.send(doc);
        },(e)=>{
            res.status(400).send(e);
        }
    );
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
            res.send({todos}) //ECMS 6 ==>"todos:todos". could've sent back just the collection, instead sendings back an object I could add some new features
        },(e)=>{
            res.status(400).send(e);
        }
    );
});

app.listen(3000,()=>{
    console.log('listening to port 3000');
});

module.exports = {app};


