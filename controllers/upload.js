const crypto = require('crypto');
const moment = require('moment');
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
        console.log(req.headers);
        return res.json({success: true});
    }
};
