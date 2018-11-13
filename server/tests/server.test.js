const expect = require('expect');
const request = require('supertest');
var {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [
    {
        text:"fist test to do",
        _id: new ObjectID()
    },
    {
        text:"second test to do",
        _id: new ObjectID()
    }
];

//Executes before every test case
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return  Todo.insertMany(todos);
    })
    .then(()=>done());
});

describe('POST /todos', ()=>{
    it('should create a new todo', (done)=>{
        const text = "test todo text";

        request(app)
        .post('/todos')
        .send({text}) // data to be stored in DB in field "text"
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        });
    });

    it('should not create a new todo', (done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>done(e));
        });

    });
});

describe('/GET todos', ()=>{
    it('should get all todos',(done)=>{
            request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                    expect(res.body.todos.length).toBe(2);
                }
            )
            .end(done);
        }
    );
});

describe('/GET todos/:id', ()=>{
    it('should return todo doc',(done)=>{
            request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                    expect(res.body.todo.text).toBe(todos[0].text);
                }
            )
            .end(done);
        }
    );

    it('should return 404 if id not found',(done)=>{
        //To carry out this I need a random ID
        var id = new ObjectID();
        request(app)
        .get(`/todos/${id.toHexString()}`)
        .expect(404)
        .end(done);        
    });

    it('should return 404 if for non-objects ids',(done)=>{
        
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);        
    });
});