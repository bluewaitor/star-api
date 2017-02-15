var express = require("express");
var route = express.Router();
var User = require("../models/User");
var Article = require("../models/Article");
var requireAuth = require('../middlewares/requireAuth');
var requireAdmin = require('../middlewares/requireAdmin');
/**
 * 根据id获取用户
 */
route.get('/users/:id', requireAuth, function(req, res) {
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if(err) return json.status(403).json({
            success: false,
            message: "查无此人"
        });

        res.json({
            success: true,
            user: user
        })
    })
});

/**
 * 获取所有用户
 */
route.get("/users", requireAuth, requireAdmin, function(req, res) {
    User.find({}, 'username createdAt date type', function(err, users) {
        if(err) throw err;
        res.json({
            success: true,
            message: "获取用户成功",
            users: users
        })
    })
});

/**
 * 添加文章
 */
route.post("/articles", requireAuth, function(req, res) {
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
});


route.get('/articles', function(req, res) {
    Article.find({}, function(err, articles) {
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
})

module.exports = route;