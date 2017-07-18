const User = require('../models/User');

module.exports = {
    username: async (req, res, next) => {
        const {username} = req.body;
        let user = await User.findOne({username});
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
    },
    email: async (req, res, next) => {
        const {email} = req.body;

        const rEmail = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/;
        if (!rEmail.test(email)) {
            return res.json({
                success: false,
                message: '邮箱不符合规则'
            })
        }
        let user = await User.findOne({email});
        if (user) {
            res.json({
                success: false,
                message: "该邮箱已被注册"
            })
        } else {
            res.json({
                success: true,
                message: "可以使用该邮箱"
            })
        }
    },

    password: async (req, res, next) => {
        let {password} = req.body;
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