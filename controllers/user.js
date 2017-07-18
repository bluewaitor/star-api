
const User = require('../models/User');

module.exports = {
    getSelfInfo: function(req, res) {
        var id = req.decoded.id;
        User.findById(id, 'username created type', function(err, user) {
            if(err) return res.status(403).json({
                success: false,
                message: "查无此人"
            });

            res.json({
                success: true,
                user: user
            })
        })
    },
    updatePassword: function(req, res) {
        var oldPassword = req.body.oldPassword;
        var newPassword = req.body.newPassword;
        var repeatPassword = req.body.repeatPassword;
        var id = req.decoded.id;
        if(newPassword !== repeatPassword) {
            return res.json({
                success: false,
                message: "新密码和重复新密码不一致"
            })
        }
        User.findById(id, function (err, user) {
            if(!err && user) {
                user.comparePassword(oldPassword, function (err, isMatch) {
                    if(!isMatch) {
                        return res.json({
                            success: false,
                            message: "老密码错误"
                        })
                    } else{
                        user.password = newPassword;
                        user.save(function(newErr, newUser) {
                            if(!newErr && newUser) {
                                res.json({
                                    success: true,
                                    message: "密码修改成功"
                                })
                            }else{
                                res.json({
                                    success: false,
                                    message: "密码修改失败"
                                })
                            }
                        })
                    }
                })
            }else{
                return res.json({
                    success: false,
                    message: "用户不存在"
                });
            }
        });
    },

    updateGender: function(req, res) {
        var gender = req.body.gender;
        var id = req.decoded.id;
        User.findById(id, function (err, user) {
            if(!err && user) {
                user.gender = gender;
                user.save(function(newErr, newUser) {
                    if(!newErr && newUser) {
                        res.json({
                            success: true,
                            message: "性别修改成功"
                        })
                    }else{
                        res.json({
                            success: false,
                            message: "性格修改失败"
                        })
                    }
                });
            }else{
                return res.json({
                    success: false,
                    message: "用户不存在"
                });
            }
        });
    },

    getAllUser: function(req, res) {
        var page = Number(req.query.page) || 1;
        var limit = Number(req.query.limit) || 10;
        User.paginate({}, {page: page, limit: limit, sort: '-created'}, function(err, users) {
            if(err) throw err;
            res.json({
                success: true,
                message: "获取用户成功",
                users: users
            });
        })
    }
}