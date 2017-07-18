const Article = require('../models/Article');
const Comment = require('../models/Comment');

module.exports = {

    getArticlesByAdmin: async (req, res, next) => {
        var page = Number(req.query.page) || 1;
        var limit = Number(req.query.limit) || 10;
        Article.paginate({}, {page: page, limit: limit, sort: '-created', populate: {path: 'user', select: 'username date'}}, function(err, articles){
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

    getPublishArticlesByPage: async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        let articles = await Article.paginate({
            secret: false,
            publish: true
        }, {
            page: page,
            limit: limit,
            sort: '-created',
            populate: {
                path: 'user',
                select: 'username'
            }
        });
        return res.json({
            success: true,
            articles: articles
        });
    },

    getArticleById: async (req, res, next) => {
        const id = req.params.id;

        const article = await Article.findById(id).populate(
            [
                {
                    path: 'user',
                    select: 'username'
                },
                {
                    path: 'comments',
                    options: {
                        sort: '-created'
                    },
                    populate: [
                        {
                            path: 'user',
                            select: 'username'
                        },
                        {
                            path: 'replyTo', select: 'username'
                        }
                    ]
                }
            ]
        );

        return res.json({
            message: "获取文章详情成功",
            success: true,
            article: article
        })
    },

    getArticleByUserId: async (req, res, next) => {
        let articles = await Article.find({user: req.decoded.id}).sort('-created');
        return res.json({
            success: true,
            message: '获取文章成功',
            articles: articles
        })
    },

    addArticle: async (req, res, next) => {
        const {title, content, publish, secret} = req.body;
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

        const article = new Article();
        article.title = title;
        article.content = content;
        article.publish = publish;
        article.secret = secret;
        article.user = req.decoded.id;
        let newArticle = await article.save();
        return res.json({
            success: true,
            message: "新增文章成功",
            article: newArticle
        });

    },

    updateArticle: async (req, res, next) => {
        const {id} = req.params;
        const {title, content, publish, secret} = req.body;
        const userId = req.decoded.id;

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

        const condition = {_id: id};
        if(!req.decoded.user.admin) {
            condition.user = userId
        }
        const newArticle = await Article.findOneAndUpdate(condition, {title: title, content: content, publish: publish, secret: secret});
        if (newArticle) {
            return res.json({
                success: true,
                message: "修改成功",
                article: newArticle
            });
        } else {
            return res.json({
                success: false,
                message: "你不是文章的所有者",
            });
        }

    },

    addComment: async (req, res, next) => {
        const userId = req.decoded.id;
        const {comment, article, replyTo} = req.body;
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

        const newComment = new Comment();
        newComment.article = article;
        newComment.user = userId;
        newComment.comment = comment;
        if(replyTo) {
            newComment.replyTo = replyTo;
        }
        await newComment.save();
        await Article.findByIdAndUpdate(article, {$push: {comments: newComment._id}}, {new: true});
        return res.json({
            message: '评论成功',
            success: true,
            comment: newComment
        });

    }
};