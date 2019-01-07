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
        _id: new ObjectID(),
        completed:true,
        completedAt:333
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

describe('/DELETE delete/:id',()=>{
    it('should remove a todo',(done)=>{
        var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/delete/${hexId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
       
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toNotExist;
                done();
            }).catch((e)=> done(e));
        });
    });

    it('should retunr a 404 if todo not found',(done)=>{
        var id = new ObjectID();
        request(app)
        .delete(`/delete/${id.toHexString()}`)
        .expect(404)
        .end(done);  
    });

     it('should 404 if object id is invalid',(done)=>{
        request(app)
        .delete(`/delete/123`)
        .expect(404)
        .end(done);   
     });
});

describe('PATCH /patch/:id',()=>{
    it('should update todo',(done)=>{
        var hexId = todos[0]._id.toHexString();
        var text = 'test to change';

        request(app)
        .patch(`/patch/${hexId}`)
        .send({completed: true,
              text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);
    });

    it('should clear completedAt when todo is not complete',(done)=>{
        var hexId = todos[1]._id.toHexString();
        var text = 'test to change2';

        request(app)
        .patch(`/patch/${hexId}`)
        .send({completed: false,
              text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist;
        })
        .end(done);
    });
});