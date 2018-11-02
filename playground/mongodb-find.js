// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client)=>{
    if(err){
        return    console.log('unable to connect to Mongodb server');
    }
    console.log('Connected to Mongodb server!');
    const db = client.db('TodoApp');
    
    db.collection('todos').find(
        {
            _id:new ObjectID('5bdac6868f542b05f4508745')
        })
        .toArray().then((docs)=>
            {
                console.log('todos');
                console.log(JSON.stringify(docs,undefined,2));
            }, (err)=>{
                console.log('unable to fetch todos');
            }
        );
    //client.close();
});