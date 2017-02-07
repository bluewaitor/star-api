var express = require("express");
var route = express.Router();
var User = require("../models/User");
var requireAuth = require('../middlewares/requireAuth');
var requireAdmin = require('../middlewares/requireAdmin');
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
route.get("/users", requireAuth, requireAdmin, function(req, res) {
    User.find({}, 'username createdAt date type', function(err, users) {
        if(err) throw err;
        res.json({
            success: true,
            message: "获取用户成功",
            users: users
        })
    })
})

module.exports = route;