var {mongoose} = require('../server/db/mongoose');
var {Todo} = require('../server/models/todo');
var {User} = require('../server/models/user');
var {ObjectID} = require('mongodb');

//does not return info about the doc just removed but how many have been removed.
// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

//These both work quite similar. You are able to check info of the doc just deleted
Todo.findOneAndRemove({_id: 'asd'}).then((todo)=>{
    console.log(todo);
});

Todo.findByIdAndRemove({_id: 'asd'}).then((todo)=>{
    console.log(todo);
});


