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

app.post('/users/login',async (req,res)=>{

    //pick to make up body
    var body = _.pick(req.body,['email','password']);  
    
    try{
        var user= await User.findByCredentials(body.email,body.password);
        var token = await user.generateAuthToken();
        res.header('x-auth',token).send(user);
    } catch(e){
        res.status(400).send(e);
    }
});

app.post('/users/newUser', async (req,res)=>{

    //pick to make up body
    var userData = _.pick(req.body,['email','password']);
    var user = new User(userData);

    try{
        await user.save();
        var token= await user.generateAuthToken();
        res.header('x-auth',token).send(user);
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
       
});

app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

app.delete('/users/me/token',authenticate, async (req,res)=>{

    try{
        var user = await req.user.removeToken(req.token);
        res.status(200).send(user);
        }    
        catch(e){
            res.status(400).send();  
        }
    });

app.post('/todos',authenticate, async(req,res)=>{
    var todo = new Todo ({
        text: req.body.text,
        _creator: req.user._id
    });
    try{    
        var doc = await todo.save();
        res.send(doc);
    }
    catch(e){
        res.status(400).send(e);     
    }
});

app.get('/todos',authenticate, async (req,res)=>{

    try{
        var todos =await  Todo.find({_creator:req.user._id});
        res.send({todos}); //ECMS 6 ==>"{todos:todos}". could've sent back just the collection, instead sendings back an object I could add some new features(more flexibility)
    }
    catch(e){
        res.status(400).send(e);
    }
});

app.get('/todos/:id',authenticate, async(req,res)=>{
     var id = req.params.id;
     //valid id provided
     if(!ObjectID.isValid(id)){
        return res.status(404).send();
     }

     try{
        var todo= await Todo.findOne({_id:id,_creator:req.user._id});
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }
    catch(e){
        res.status(400).send(e);
    }
});

app.delete('/todos/:id',authenticate,async(req,res)=>{

    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    try{
        var todo= await Todo.findOneAndRemove({_id:id, _creator:req.user._id});
        if(!todo){
            res.status(404).send(todo);
        }
        res.send({todo});    }
    catch(e){
        res.status(400).send(e);
    }
});

app.patch('/todos/:id',authenticate, async(req,res)=>{
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

    try{
        var todo = await Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true});
        if(!todo){
            return res.status(404).send('not todo found with specifeid ID');
        }
        res.send({todo});
    }
    catch(e){
        res.status(404).send(e);
    }
});

app.listen(port,()=>{
    console.log(`Starting at port ${port}`);
});

module.exports = {app};
