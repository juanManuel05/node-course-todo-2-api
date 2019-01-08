require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var port = process.env.PORT;
 
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

app.post('/newUser',(req,res)=>{

    //pick to make up body
    var userData = _.pick(req.body,['email','password']);
    var user = new User(userData);
    user.save().then((user)=>{
            res.send(user);
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

app.delete('/delete/:id',(req,res)=>{

    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            res.status(404).send(todo);
        }
        res.send({todo});
    }).catch((e)=>res.status(400).send(e));
});

app.patch('/patch/:id',(req,res)=>{
    var id = req.params.id;

    //Limit the user scope so he's just able tu update 'text' and 'completed' fields. When updating the field "$set:body"
    //I just update the fields contained in "body" by that time.
    var body = _.pick(req.body,['text','completed']);
    console.log(body);

    //valid ID
    if(!ObjectID.isValid(id)){
        return res.status(404).send('id not valid');
    }

    if(_.isBoolean(body.completed) && body.completed){
        console.log('completed true');
        body.completedAt = new Date().getTime();
    }else{
        console.log('completed false');
        body.completed = false;
        body.completedAt= null;
    }
    
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send('not todo');
        }
        res.send({todo})
    }).catch((e)=>res.status(404).send(e));
});

app.listen(port,()=>{
    console.log(`Starting at port ${port}`);
});

module.exports = {app};
