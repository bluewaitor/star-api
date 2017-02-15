var express = require('express');

var router = express.Router();

var signupCheck = require('./signup_check');
var users = require('./users');

module.exports = function(app){
    
    app.use('/signup_check/username', signupCheck.username);

    app.use('/signup', users.signup);
    app.use('/login', users.login);
    app.use('/user', users.user);
};
