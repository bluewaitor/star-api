var Article = require('../../models/Article');

module.exports = {
    getAllArticle: function(req, res) {
        Article.find({}).sort('-created').populate('user', 'username date').exec( function(err, articles) {
            if(!err) {
                return res.json({
                    success: true,
                    articles: articles
                })
            }else{
                return res.json({
                    success: false,
                    message: "获取文章失败"
                })
            }
        });
    },
    getArticleById: function(req, res) {
        var id = req.params.id;
        Article.findById(id).populate('user', 'username').exec(function(err, article) {
            if(!err) {
                return res.json({
                    message: "获取文章详情成功",
                    success: true,
                    article: article
                })
            }else{
                return res.json({
                    success: false,
                    message: "获取文章详情失败"
                })
            }
        })
    }
}