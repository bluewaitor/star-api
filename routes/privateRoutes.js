var express = require("express");
var route = express.Router();
var User = require("../models/User");
var jwt = require('jsonwebtoken');
var config = require('../config/config');

route.use(function(req, res, next) {
    var token = req.body.token || req.params.token || req.headers['token'];
    console.log(token);
    if(!token) {
        return res.status(403).json({
            success: false,
            message: "请提供token"
        })
    } else {
        jwt.verify(token, config.secret, function(err, decoded) {
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
})

route.get('/user/:id', function(req, res) {
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

module.exports = route;