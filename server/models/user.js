const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({    
    email:{
        type:String,
        minlength:1,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a valid mail'
        }       
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            require:true
        }
    }]
});
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id','email']);
};

//Since i am gonna work over entire collections i better use a static method

UserSchema.statics.findByToken = function (token){
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify (token,'abc123');
       // console.log('DECODED ******',decoded);
    }catch(e){
        return Promise.reject();
    }

    //No problems found, return a user as lon as data matches
     return User.findOne({
         '_id':decoded._id,
         'tokens.token':token,
         'tokens.access': 'auth'
     });
};
UserSchema.pre('save',function(next){
    var user = this

    //Only move froward if password is being modified
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                console.log(hash);
                user.password = hash;
                console.log('hashedPpassword', user.password);
                next();
            });
        });        
    }else{
        next();
    }
});


UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access,token}]);
    return user.save().then(()=>{
        return token;
    });
};

var User = mongoose.model('User',UserSchema);

module.exports = {User};