
var jwt = require('jsonwebtoken');
var appConfig = require('../config/appConfig');
var User = require('../models/User');

module.exports = {
    signup: function(req, res) {
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
        if(password.length < 6) {
            return res.json({
                success: false,
                message: "密码至少6位"
            });
        }
        var user = new User();
        user.username = username;
        user.password = password;
        
        user.save(function(err, insertedUser) {
            if(err) {
                if(err.code == 11000 && err.name == "MongoError") {
                    res.status(400).send({success: false, message: "该用户已存在"});
                } else{
                    throw err;
                }
            }else{
                jwt.sign({id: insertedUser.id, user: {username: insertedUser.username, date: insertedUser.date, admin: insertedUser.admin}}, appConfig.secret, {expiresIn: appConfig.expireTime}, function(error, token) {
                    if(!error) { 
                        res.json({success: true, message: "注册成功", token: token});
                    }else{
                        throw error;
                    }
                });
            }
        });
    },

    login: function (req, res) {
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

            if(!err && user) {
        
                user.comparePassword(password, function (err, isMatch) {
                    if(!isMatch) {
                        return res.json({
                            success: false,
                            message: "密码错误"
                        })
                    } else{
                        jwt.sign({id: user.id, user: {username: user.username, date: user.date, admin: user.admin}}, appConfig.secret, {expiresIn: appConfig.expireTime}, function(error, token) {
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
                    message: "用户不存在"
                });
            }
        })
    },

    user: function(req, res) {
        var username = req.body.username;
        User.findOne({username: username}, function(err, user) {
            if(user) {
                return res.json({
                    success: false,
                    message: "用户名已存在"
                })
            }else{
                return res.json({
                    success: true,
                    message: "用户名可以使用"
                })
            }
        })
    }
};