//Node libraries
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//Models
var {Todo} = require('../models/todo');

exports.new_todo = async (req,res)=>{
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
};

exports.get_todos= async (req,res)=>{
    try{
        var todos =await  Todo.find({_creator:req.user._id});
        res.send({todos}); //ECMS 6 ==>"{todos:todos}". could've sent back just the collection, instead sendings back an object I could add some new features(more flexibility)
    }
    catch(e){
        res.status(400).send(e);
    }
};

exports.get_todo_id = async(req,res)=>{
    var id = req.params.id;
    //valid id provided
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }

    try{
       var todo= await Todo.findOne({_id:id,_creator:req.user._id});
       if(!todo){
           return res.status(404).send('Todo not found');
       }
       res.send({todo});
   }
   catch(e){
       res.status(400).send(e);
   }
};

exports.delete_todo = async(req,res)=>{

    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    try{
        var todo= await Todo.findOneAndRemove({_id:id, _creator:req.user._id});
        if(!todo){
            res.status(404).send(todo);
        }
        res.send({todo});    
    }
    catch(e){
        res.status(400).send(e);
    }
};

exports.patch_todo = async(req,res)=>{
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
};