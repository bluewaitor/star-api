var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Article = require("../models/Article");
var requireAuth = require('../middlewares/requireAuth');
var requireAdmin = require('../middlewares/requireAdmin');
var users = require('./private/users');
var articles = require('./private/articles');
var stars = require('./private/stars');
var comments = require('./private/comments');

module.exports = function(app) {

    /**
     * 获取自己的信息
     */
    router.get('/me', requireAuth, users.getSelfInfo);

    /**
     * 修改密码
     */
    router.put('/users/password', requireAuth, users.updatePassword);

    /**
     * 修改性别
     */
    router.put('/users/gender', requireAuth, users.updateGender);

    /**
     * 获取所有用户
     */
    router.get("/users", requireAuth, requireAdmin, users.getAllUser);

    /**
     * 获取所有文章
     */
    router.get('/dashboard/articles', requireAuth, requireAdmin, articles.getAllArticles);

    /**
     * 获取自己的文章
     */
    router.get('/me/articles', requireAuth, articles.getMyArticles);

    /**
     * 添加文章
     */
    router.post("/articles", requireAuth, articles.addArticle);

    /**
     * 根据id修改文章, 需要登录, 并且文章是本人的
     */
    router.put('/articles/:id', requireAuth, articles.updateArticle);

    /**
     * 添加收藏
     */
    router.post('/stars', requireAuth, stars.addStar);

    /**
     * 获取公开收藏
     */
    router.get('/stars', requireAuth, stars.getPublicStars);

    /**
     * 获取自己的收藏
     */
    router.get('/stars/me', requireAuth, stars.getMyStars);

    /**
     * 更新访问次数
     */
    router.patch('/stars/:id', requireAuth, stars.patchVisits);

    /**
     * 添加评论
     */
    router.post('/comments', requireAuth, comments.addComment);

    /**
     * 应用到根目录
     */
    app.use('/', router);
};