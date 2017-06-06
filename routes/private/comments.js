var Comment = require('../../models/Comment');
var Article = require('../../models/Article');
module.exports = {
    addComment: function(req, res) {
        var userId = req.decoded.id;
        var comment = req.body.comment;
        var article = req.body.article;
        var replyTo = req.body.replyTo;
        if(!comment) {
            return res.json({
                message: '评论不能为空',
                success: false
            });
        }
        if(comment.length > 200) {
            return res.json({
                message: '评论长度不能超过200',
                success: false
            });
        }
        if(!article) {
            return res.json({
                message: '必须评论某篇文章',
                success: false
            });
        }

        var newComment = new Comment();
        newComment.article = article;
        newComment.user = userId;
        newComment.comment = comment;
        if(replyTo) {
            newComment.replyTo = replyTo;
        }
        newComment.save(function(err) {
            if(err) {
                return res.json({
                    message: '评论失败',
                    success: false,
                    err: err
                });
            }
            Article.findByIdAndUpdate(article, {$push: {comments: newComment._id}}, {new: true}, function(error, word) {
                if(error) {
                    return res.json({
                        message: '评论失败',
                        success: false,
                        err: error
                    });
                }

                return res.json({
                    message: '评论成功',
                    success: true,
                    comment: newComment
                });

            });

        })
    }
};