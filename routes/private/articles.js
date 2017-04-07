var Article = require('../../models/Article');

module.exports = {

    getAllArticles: function(req, res) {
        Article.find({}).sort('-created').populate('user', 'username date').exec(function(err, articles) {
            if(!err) {
                return res.json({
                    success: true,
                    message: '获取文章成功',                    
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

    getMyArticles: function(req, res){
        Article.find({user: req.decoded.id}).sort('-created').exec(function(err, articles){
            console.log(articles)
            console.log(err)
            if(!err) {
                return res.json({
                    success: true,
                    message: '获取文章成功',
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

    addArticle: function(req, res) {
        var title = req.body.title;
        var content = req.body.content;
        var publish = req.body.publish;
        var secret = req.body.secret;
        if(!title) {
            return res.json({
                success: false,
                message: "文章标题不能为空"
            });
        }

        if(!content) {
            return res.json({
                success: false,
                message: "文章内容不能为空"
            });
        }

        var article = new Article();
        article.title = title;
        article.content = content;
        article.publish = publish;
        article.secret = secret;
        article.user = req.decoded.id;
        article.save(function(err, insertedArticle) {
            if(err) {
                
            }else{
                return res.json({
                    success: true,
                    message: "新增文章成功",
                    article: insertedArticle
                })
            }
        });
    },

    updateArticle: function(req, res) {
        var id = req.params.id;
        var title = req.body.title;
        var content = req.body.content;
        var publish = req.body.publish;
        var secret = req.body.secret;
        var userId = req.decoded.id;

        if(!title) {
            return res.json({
                success: false,
                message: "文章标题不能为空"
            });
        }

        if(!content) {
            return res.json({
                success: false,
                message: "文章内容不能为空"
            });
        }

        var condition = {_id: id};
        if(!req.decoded.user.admin) {
            condition.user = userId
        }
        Article.findOneAndUpdate(condition, {title: title, content: content, publish: publish, secret: secret}, function(err, newArticle){
            if(!err && newArticle) {
                return res.json({
                    success: true,
                    message: "修改成功",
                    article: newArticle
                })
            }else{
                return res.json({
                    success: false,
                    message: "你不是该文章的所有者",
                    err: err,
                    article: newArticle
                })
            }
        });
    }
}