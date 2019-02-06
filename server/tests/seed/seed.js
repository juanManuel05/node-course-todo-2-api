const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'juangarmendia2000@hotmail.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }, {
    _id: userTwoId,
    email: 'juangarmendia2001@hotmail.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }]
  }];

const todos = [
    {
        text:"fist test to do TEST_ENV",
        _id: new ObjectID(),
        _creator: userOneId
    },
    {
        text:"second test to do TEST_ENV",
        _id: new ObjectID(),
        completed:true,
        completedAt:333,
        _creator: userTwoId
    }
];

const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return  Todo.insertMany(todos);
    })
    .then(()=>done());
};

const populateUsers = (done)=> {
    User.remove({}).then(()=>{
        /** In this case, we do not use 'insertMany' because Id wouldn't access the middlewares when saving into the DB */
        var userOne = new User (users[0]).save();
        var usertwo = new User (users[1]).save();
         
        /** All() wait for all of the items in the arrey to succeed. The callback won't get fired until */
        /** all of the promises get resolved succesfully into the DB */
        return Promise.all([userOne,usertwo]);
    }).then(()=>done());
};

module.exports = {todos,populateTodos,users,populateUsers};