var express = require('express');

var router = express.Router();

var signupCheck = require('./public/signup_check');
var users = require('./public/users');
var articles = require('./public/articles');

module.exports = function(app){
    
    /**
     * 检查用户名
     */
    router.post('/signup_check/username', signupCheck.username);

    /**
     * 检查邮箱
     */
    router.post('/signup_check/email', signupCheck.email);

    /**
     * 检查密码
     */
    router.post('/signup_check/password', signupCheck.password);

    /**
     * 用户注册
     */
    router.post('/signup', users.signup);

    /**
     * 用户登录
     */
    router.post('/login', users.login);

    /**
     * 获取所有的文章
     */
    router.get('/articles', articles.getAllArticle);

    /**
     * 根据id获取文章
     */
    router.get('/articles/:id', articles.getArticleById);

    /**
     * 应用到根目录
     */
    app.use('/', router)
};
