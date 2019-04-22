//Node libraries
const _ = require('lodash');

//Middleware
var {authenticate} = require('../Middleware/authenticate');

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

exports.me = authenticate, (req,res)=>{
    console.log('============');
    res.send(req.user);
}

exports.delete_token = authenticate, async (req,res)=>{
    try{
        var user = await req.user.removeToken(req.token);
        res.status(200).send(user);
    }    
    catch(e){
        res.status(400).send();  
    }
};