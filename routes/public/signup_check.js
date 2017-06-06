var User = require('../../models/User');

module.exports = {
    username: function (req, res) {
        User.findOne({username: req.body.username}).then(function (user) {
            if (user) {
                res.json({
                    success: false,
                    message: "该用户名已被占用"
                })
            } else {
                res.json({
                    success: true,
                    message: "可以使用该用户名"
                })
            }
        }).catch(function (err) {
            res.json({
                success: false,
                message: "出错啦",
                err: err
            })
        });

    },
    email: function (req, res) {
        User.findOne({email: req.body.email}).then(function (user) {
            if (user) {
                res.json({
                    success: false,
                    message: "该邮箱已被占用"
                })
            } else {
                res.json({
                    success: true,
                    message: "可以使用该邮箱"
                })
            }
        }).catch(function (err) {
            console.log(err);
        })
    },
    password: function (req, res) {
        var password = req.body.password;

        if (password.length < 6) {
            return res.json({
                success: false,
                message: '密码至少要6位'
            });
        }

        return res.json({
            success: true,
            message: '可以使用该密码'
        })
    }
};