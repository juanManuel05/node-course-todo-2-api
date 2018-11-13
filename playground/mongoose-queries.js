var {mongoose} = require('../server/db/mongoose');
var {Todo} = require('../server/models/todo');
var {User} = require('../server/models/user');
var {ObjectID} = require('mongodb');

var id = "5be93e556ba94a31ec7e45ab";
var idUser = "5be3ed0847e03d1eb0ebbfd9";

// if(!ObjectID.isValid(id)){
//     console.log('ID nota valid');
// }

// Todo.find({_id:id}).then((todos)=>{
//     console.log('todos: ',todos);
// });

// Todo.findOne({_id:id}).then((todos)=>{
//     console.log('todo: ',todo);
// });

// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('nothing found with the provided id');
//     }
//     console.log('Object found: ', todo);
// }).catch((e)=> console.log('Unexpected error: ',e));

User.findById(idUser).then((user)=>{
    if(!user){
        return console.log('not user foundd');
    }
    console.log('user found: ',user);
}).catch((e)=> console.log('unexpected error trying to get the user: ',e));
