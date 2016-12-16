var express = require('express');

var route = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var User = require('../models/User');


route.post('/signup', function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.save(function(err, insertedUser) {
        if(err) {
            if(err.code == 11000 && err.name == "MongoError") {
                res.status(400).send({success: false, message: "该用户已存在"});
            } else{
                throw err;
            }
        }else{
            jwt.sign({id: insertedUser.id}, config.secret, {expiresIn: 60}, function(error, token) {
                if(!error) { 
                    res.json({success: true, message: "注册成功", token: token});
                }else{
                    throw error;
                }
            })
         }
        
    });
});


module.exports = route;
