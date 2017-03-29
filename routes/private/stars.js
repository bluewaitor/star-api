var Star = require('../../models/Star');


module.exports = {
    addStar: function(req, res) {
        var title = req.body.title;
        var url = req.body.url;
        if(!title) {
            return res.json({
                success: false,
                message: '必须填写标题'
            });
        }
        if(!url) {
            return res.json({
                success: '必须填写url'
            });
        }

        Star.find({user: req.decoded.id, url: url}, function(err, existStar) {
            if(!err && existStar.length != 0) {
                console.log(existStar);
                return res.json({
                    success: false,
                    message: '这个地址你已经收藏过了',
                });
            }

            var star = new Star();
            star.title = title;
            star.url = url;
            star.user = req.decoded.id;

            star.save(function(err, newStar) {
                if(!err && newStar) {
                    return res.json({
                        success: true,
                        message: '添加收藏成功',
                        star: newStar
                    });
                }else{
                    return res.json({
                        success: false,
                        message: '添加收藏失败',
                        err: err
                    });
                }
            });
        })

        
    },

    getPublicStars: function(req, res) {
        Star.find({public: true}, function(err, stars) {
            if(!err && stars) {
                return res.json({
                    success: true,
                    message: '获取收藏成功',
                    stars: stars
                });
            } else {
                return res.json({
                    success: false,
                    message: '获取收藏失败',
                    err: err
                });
            }
        })
    },

    getMyStars: function(req, res) {
        Star.find({user: req.decoded.id}, null, {sort: {visits: -1, updated: -1}}, function(err, stars) {
            if(!err && stars) {
                return res.json({
                    success: true,
                    message: '获取收藏成功',
                    stars: stars
                });
            } else {
                return res.json({
                    success: false,
                    message: '获取收藏失败',
                    err: err
                });
            }
        })
    },

    patchVisits: function(req, res) {
        console.log(req.params.id);
        Star.findByIdAndUpdate(req.params.id, {$inc: { visits: 1 }}, {new: true}, function(err, star) {
            if(!err && star) {
                return res.json({
                    success: true,
                    message: '更新成功',
                    star: star
                });
            } else {
                return res.json({
                    success: false,
                    message: '更新失败'
                })
            }
        })   
    }
}