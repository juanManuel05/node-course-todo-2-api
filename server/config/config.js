var env = process.env.NODE_ENV || 'development';

if(env === 'development' ||env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env]; //{ PORT: 3000, MONGODB_URI: 'mongodb://127.0.0.1:27017/TodoApp' }

    //console.log(Object.keys(envConfig)); //[ 'PORT', 'MONGODB_URI' ]
    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    })

}

