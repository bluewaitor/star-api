var User = require('../models/User');

function requireAdmin(req, res, next) {
    var userId = req.decoded.id;
    User.findById(userId, function(err, user) {
        if(err) throw err;
        if(user.admin) {
            next();
        }else{
            res.status(403).json({
                success: false,
                message: "只有管理员才有资格"
            })
        }
    });
}


module.exports = requireAdmin;