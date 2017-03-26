var User = require('../../models/User');

module.exports = {
    username: function(req, res) {
        User.findOne({username: req.body.username }, function(err, user) {
            if(user) {
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
        })
    }
}