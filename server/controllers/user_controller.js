//Node libraries
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//Models
var {User} = require('../models/user');

exports.user_login =async (req,res)=>{

    //pick to make up body
    var body = _.pick(req.body,['email','password']);  
    
    try{
        var user= await User.findByCredentials(body.email,body.password);
        var token = await user.generateAuthToken();
        res.header('x-auth',token).send(user);
    } catch(e){
        res.status(400).send(e);
    }
};

exports.new_user =  async (req,res)=>{

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
};

exports.me = function (req,res){
    res.send(req.user);
}

exports.delete_token = async (req,res)=>{
    try{
        var user = await req.user.removeToken(req.token);
        res.status(200).send(user);
    }    
    catch(e){
        res.status(400).send();  
    }
};

exports.delete_user = async (req,res)=>{
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }    
};