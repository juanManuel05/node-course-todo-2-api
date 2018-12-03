// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client)=>{
    if(err){
        return    console.log('unable to connect to Mongodb server');
    }
    console.log('Connected to Mongodb server!');
    const db = client.db('TodoApp');
    
    db.collection('Users').findOneAndUpdate(
        {
            name:'juan'
        },
        {
            $set:{name:'loquito'},
            $inc:{age:1}
        },
        {
            returnOriginal:false
        }
    ).then((result)=>{
        console.log(result);
    });
    //client.close();
});
