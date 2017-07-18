
const User = require('../models/User');

module.exports = {
    getSelfInfo: async (req, res, next) => {
        const id = req.decoded.id;
        let user = await User.findById(id, 'username created type');
        res.json({
            success: true,
            user: user
        });
    },
    updatePassword: async (req, res, next) => {
        const {oldPassword, newPassword, repeatPassword} = req.body;
        const id = req.decoded.id;
        if(newPassword !== repeatPassword) {
            return res.json({
                success: false,
                message: "新密码和重复新密码不一致"
            })
        }
        let user = await User.findById(id);
        if (user) {
            user.comparePassword(oldPassword, async function (err, isMatch) {
                if(!isMatch) {
                    return res.json({
                        success: false,
                        message: "老密码错误"
                    })
                } else{
                    user.password = newPassword;
                    let newUser = await user.save();
                    if (newUser) {
                        return res.json({
                            success: true,
                            message: "密码修改成功"
                        })
                    } else {
                        return res.json({
                            success: false,
                            message: "密码修改失败"
                        })
                    }
                }
            })
        } else {
            return res.json({
                success: false,
                message: "用户不存在"
            });
        }
    },

    updateGender: async (req, res, next) => {
        const gender = req.body.gender;
        const id = req.decoded.id;
        let user = await User.findById(id);
        if (user) {
            user.gender = gender;
            let newUser = await user.save();
            if (newUser) {
                return res.json({
                    success: true,
                    message: "性别修改成功"
                })
            } else {
                return res.json({
                    success: false,
                    message: "性格修改失败"
                })
            }
        } else {
            return res.json({
                success: false,
                message: "用户不存在"
            });
        }
    },

    getAllUser: async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        let users = await User.paginate({}, {page: page, limit: limit, sort: '-created'});

        if (users) {
            res.json({
                success: true,
                message: "获取用户成功",
                users: users
            });
        }
    }
};