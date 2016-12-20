var jwt = require('jsonwebtoken');
var appConfig = require('../config/appConfig');

function requireAuth(req, res, next){
    var token = req.body.token || req.params.token || req.headers['token'];
    if(!token) {
        return res.status(403).json({
            success: false,
            message: "请提供token"
        })
    } else {
        jwt.verify(token, appConfig.secret, function(err, decoded) {
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

module.exports = requireAuth;