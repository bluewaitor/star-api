var express = require('express');

var route = express.Router();
var jwt = require('jsonwebtoken');
var appConfig = require('../config/appConfig');
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
            jwt.sign({id: insertedUser.id}, appConfig.secret, {expiresIn: appConfig.expireTime}, function(error, token) {
                if(!error) { 
                    res.json({success: true, message: "注册成功", token: token});
                }else{
                    throw error;
                }
            });
        }
    });
});


route.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if(!username) {
        return res.json({
            success: false,
            message: "用户名不能为空"
        });
    }
    if(!password) {
        return res.json({
            success: false,
            message: "密码不能为空"
        });
    }

    User.findOne({username: username}, function (err, user) {
        if(!err) {
            user.comparePassword(password, function (err, isMatch) {
                if(!isMatch) {
                    return res.json({
                        success: false,
                        message: "密码错误"
                    })
                } else{
                    jwt.sign({id: user.id}, appConfig.secret, {expiresIn: appConfig.expireTime}, function(error, token) {
                        if(!error) { 
                            return res.json({
                                success: true,
                                message: "给你token",
                                token: token
                            });
                        }else{
                            throw error;
                        }
                    });
                    
                }
            })
        }else{
            return res.json({
                success: false,
                message: "用户名不存在"
            });
        }

    })

});

module.exports = route;
