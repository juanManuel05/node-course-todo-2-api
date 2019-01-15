const {SHA256} = require('crypto-js');
 const jwt  = require('jsonwebtoken');

 var data = {
     id:10
 };

 var token = jwt.sign(data,'123abc');
console.log(token);

var decoded =  jwt.verify(token,'123abc');
console.log('============');
console.log('decoded',decoded);


// var message = 'i am user 2';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);