var {User} = require ('../models/user');

var authenticate = async (req,res,next) =>{
    
    var token = req.header('x-auth');
    try{
    var user = await User.findByToken(token);
    //No user found
      if(!user){
          return Promise.reject();
      }
    }
    catch(e){
        res.status(401).send();
    }
    req.user = user;
    req.token = token;
    next();    
};

module.exports = {authenticate};