// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client)=>{
    if(err){
        return    console.log('unable to connect to Mongodb server');
    }
    console.log('Connected to Mongodb server!');
    const db = client.db('TodoApp');
    
    //deleteMany
    db.collection('todos').deleteMany({text:'Eat lunch'}).then((result)=>
        {
            console.log(result);
        }
    );
    //client.close();
});

    //DeleteOne---> Delete the very first elemento that matches with the condition

    //findOneAndDelete--->Delete the very first elemento that matches with the condition but also returns 
    //                    the documents back recently deleted.