var Article = require('../../models/Article');

module.exports = {
    addArticle: function(req, res) {
        var title = req.body.title;
        var content = req.body.content;
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
        Article.findOneAndUpdate(condition, {title: title, content: content}, function(err, newArticle){
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