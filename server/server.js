require('./config/config');


const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {authenticate} = require('./Middleware/authenticate');

var port = process.env.PORT;
 
var app = express();

app.use(bodyParser.json()); 

app.post('/users/login',(req,res)=>{

    //pick to make up body
   var body = _.pick(req.body,['email','password']);  

   User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
   }).catch((e)=>{
        res.status(400).send();
   });
   
});

app.post('/users/newUser',(req,res)=>{

    //pick to make up body
    var userData = _.pick(req.body,['email','password']);
    var user = new User(userData);

    user.save().then(()=>{
        return user.generateAuthToken();
        })
        .then((token)=>{
            res.header('x-auth',token).send(user);
        })
        .catch((e)=>{
            res.status(400).send(e);
        });    
});

app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then((user)=>{
        res.status(200).send(user);
    },()=>{
      res.status(400).send();  
    });
});

app.post('/todos',authenticate,(req,res)=>{
    var todo = new Todo ({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc)=>{
            res.send(doc);
        },(e)=>{
            res.status(400).send(e);
        }
    );
});

app.get('/todos',authenticate,(req,res)=>{
    Todo.find({_creator:req.user._id}).then((todos)=>{
            res.send({todos}); //ECMS 6 ==>"{todos:todos}". could've sent back just the collection, instead sendings back an object I could add some new features(more flexibility)
        },(e)=>{
            res.status(400).send(e);
        }
    );
});

app.get('/todos/:id',authenticate,(req,res)=>{
     var id = req.params.id;
     //valid id provided
     if(!ObjectID.isValid(id)){
        return res.status(404).send();
     }

     Todo.findOne({_id:id,_creator:req.user._id}).then((todo)=>{
         if(!todo){
            return res.status(404).send();
         }
         res.send({todo});
     }).catch((e)=>res.status(400).send(e));

});

app.delete('/todos/:id',authenticate,(req,res)=>{

    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findOneAndRemove({_id:id, _creator:req.user._id}).then((todo)=>{
        if(!todo){
            res.status(404).send(todo);
        }
        res.send({todo});
    }).catch((e)=>res.status(400).send(e));
});

app.patch('/todos/:id',authenticate,(req,res)=>{
    var id = req.params.id;

    //Limit the user scope so he's just able tu update 'text' and 'completed' fields. When updating the field "$set:body"
    //I just update the fields contained in "body" by that time.
    var body = _.pick(req.body,['text','completed']);

    //valid ID
    if(!ObjectID.isValid(id)){
        return res.status(404).send('id not valid');
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt= null;
    }
    
    Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((todo)=>{
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
