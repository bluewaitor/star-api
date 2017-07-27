const crypto = require('crypto');
const moment = require('moment');
const request = require('request');
const appConfig = require('../config');
module.exports = {
    avatar: (req, res, next) => {
        const id = appConfig.id;
        const key = appConfig.key;
        const bucketName = appConfig.bucketName;
        const host = 'http://' + bucketName + '.oss-cn-shanghai.aliyuncs.com';
        const callbackUrl = "http://api.bluewaitor.com/upload/callback";

        let callbackParams = {
            callbackUrl: callbackUrl,
            callbackBody: "filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}",
            callbackBodyType: "application/x-www-form-urlencoded"
        };

        let callbackString = JSON.stringify(callbackParams);
        let base64CallbackBody = new Buffer(callbackString).toString('base64');

        let now = moment().unix();
        let expire = 30;
        let end = now + expire;
        let expiration = moment(end, 'X').toISOString();

        let dir = 'user-dir/';

        let arr = {
            'expiration': expiration,
            'conditions': [
                [
                    'content-length-range',
                    0,
                    1048576000
                ], [
                    'starts-with',
                    '$key',
                    dir,
                ]
            ]
        };

        let policy = JSON.stringify(arr);
        let base64_policy = new Buffer(policy).toString('base64');
        let string_to_sign = base64_policy;
        let hash = crypto.createHmac('sha1', key);
        hash.update(string_to_sign);
        let signature = new Buffer(hash.digest()).toString('base64');
        return res.json({
            accessid: id,
            host: host,
            policy: base64_policy,
            signature: signature,
            expire: end,
            callback: base64CallbackBody,
            dir: dir
        });
    },

    callback: (req, res, next) => {
        let pubKeyUrl;
        const pubKeyUrlBase64 = req.headers['x-oss-pub-key-url'];
        if (pubKeyUrlBase64) {
            pubKeyUrl = new Buffer(pubKeyUrlBase64, 'base64').toString();
        }
        if (pubKeyUrl) {
            request(pubKeyUrl, function (err, response, body) {
                if (!err) {
                    let pubKey = body;

                    let authorizationBase64 = req.headers['authorization'];
                    let authorization = new Buffer(authorizationBase64, 'base64').toString();

                    let path = req.originalUrl;
                    let pos = path.indexOf('?');

                    let authStr = '';
                    if (pos === -1) {
                        authStr = decodeURIComponent(path) + '\n' + body;
                    } else {
                        authStr = decodeURIComponent(path.substr(0, pos)) + path.substr(pos, path.length - pos) + '\n' + body;
                    }
                    console.log(authStr);

                    let hash = crypto.createHash('sha1');
                    hash.update(authStr);
                    let authStrMd5 = hash.digest();

                    let verifier = crypto.createVerify('RSA-SHA1');
                    verifier.update(new Buffer(authStrMd5, 'utf-8'));
                    let verify = verifier.verify(pubKey, authorization, 'base64');
                    console.log(verify);

                    if (verify) {
                        return res.json({success: true});
                    } else {
                        return res.json({success: false});
                    }
                } else {
                    return res.json({
                        success: false,
                        message: '获取公钥失败'
                    })
                }
            });
        } else {
            return res.json({
                success: false,
                message: 'oss callback error'
            })
        }
    }
};
