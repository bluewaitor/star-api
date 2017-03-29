var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Article = require("../models/Article");
var requireAuth = require('../middlewares/requireAuth');
var requireAdmin = require('../middlewares/requireAdmin');
var users = require('./private/users');
var articles = require('./private/articles');
var tags = require('./private/tags');
var stars = require('./private/stars');

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
     * 获取所有用户
     */
    router.get("/users", requireAuth, requireAdmin, users.getAllUser);

    /**
     * 添加文章
     */
    router.post("/articles", requireAuth, articles.addArticle);

    /**
     * 根据id修改文章, 需要登录, 并且文章是本人的
     */
    router.put('/articles/:id', requireAuth, articles.updateArticle);

    /**
     * 添加标签
     */
    router.post('/tags', requireAuth, requireAdmin, tags.addTag);

    /**
     * 获取标签
     */
    router.get('/tags', requireAuth, requireAdmin, tags.getTags);

    /**
     * 获取树形标签
     */
    router.get('/tags/tree', requireAuth, requireAdmin, tags.getTagsTree);

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
     * 应用到根目录
     */
    app.use('/', router);
};