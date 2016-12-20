var express = require("express");
var route = express.Router();
var User = require("../models/User");
var jwt = require('jsonwebtoken');
var appConfig = require('../config/appConfig');


function requireAuth(req, res, next){
    var token = req.body.token || req.params.token || req.headers['token'];
    console.log(token);
    if(!token) {
        return res.status(403).json({
            success: false,
            message: "请提供token"
        })
    } else {
        jwt.verify(token, appConfig.secret, function(err, decoded) {
            console.log(err);
            if(err) {
                if(err.name === "TokenExpiredError") {
                    return res.status(403).json({
                        success: false,
                        message: "token已经过期, 请重新获取"
                    })
                }

                return res.status(403).json({
                    success: false,
                    message: err.message
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
}

/**
 * 根据id获取用户
 */
route.get('/user/:id', requireAuth, function(req, res) {
    console.log(req.decoded);
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if(err) return json.status(403).json({
            success: false,
            message: "查无此人"
        });

        res.json({
            success: true,
            user: user
        })
    })
});

/**
 * 获取所有用户
 */
route.get("/users", requireAuth, function(req, res) {
    User.find({}, function(err, users) {
        if(err) throw err;

        res.json({
            success: true,
            message: "获取用户成功",
            users: users
        })
    })
})

module.exports = route;