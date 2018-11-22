var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var port = process.env.PORT || 3000;
 
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
            res.send({todos}); //ECMS 6 ==>"{todos:todos}". could've sent back just the collection, instead sendings back an object I could add some new features(more flexibility)
        },(e)=>{
            res.status(400).send(e);
        }
    );
});

app.get('/todos/:id',(req,res)=>{
     var id = req.params.id;
     //valid id provided
     if(!ObjectID.isValid(id)){
        return res.status(404).send();
     }

     Todo.findById(id).then((todo)=>{
         if(!todo){
            return res.status(404).send();
         }
         res.send({todo});
     }).catch((e)=>res.status(400).send());

});

app.listen(port,()=>{
    console.log(`Starting at port ${port}`);
});

module.exports = {app};