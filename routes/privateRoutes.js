var express = require("express");
var route = express.Router();
var User = require("../models/User");
var Article = require("../models/Article");
var Tag = require("../models/Tag");
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
 * 
 */
route.get('/me', requireAuth, function(req, res) {
    var id = req.decoded.id;
    User.findById(id, 'username created type',function(err, user) {
        if(err) return res.status(403).json({
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
    User.find({}, 'username created updated type', function(err, users) {
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

/**
 * 获取所有的文章, 不需要登录
 */
route.get('/articles', function(req, res) {
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
});

/**
 * 根据id获取文章, 不需要登录
 */
route.get('/articles/:id', function(req, res) {
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
});

/**
 * 根据id修改文章, 需要登录, 并且文章是本人的
 */
route.put('/articles/:id', requireAuth, function(req, res) {
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
});

route.put('/users/password', requireAuth, function(req, res) {
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var repeatPassword = req.body.repeatPassword;
    var id = req.decoded.id;
    if(newPassword !== repeatPassword) {
        return res.json({
            success: false,
            message: "新密码和重复新密码不一致"
        })
    }
    User.findById(id, function (err, user) {
        if(!err && user) {
            user.comparePassword(oldPassword, function (err, isMatch) {
                if(!isMatch) {
                    return res.json({
                        success: false,
                        message: "老密码错误"
                    })
                } else{
                    user.password = newPassword;
                    user.save(function(newErr, newUser) {
                        if(!newErr && newUser) {
                            res.json({
                                success: true,
                                message: "密码修改成功"
                            })
                        }else{
                            res.json({
                                success: false,
                                message: "密码修改失败"
                            })
                        }
                    })
                }
            })
        }else{
            return res.json({
                success: false,
                message: "用户不存在"
            });
        }
    });
});

/**
 * 添加标签
 */
route.post('/tags', requireAuth, requireAdmin, function (req, res) {
    var name = req.body.name;
    var parent = req.body.parent;
    
    if(!name) {
        return res.json({
            success: false,
            message: "标签名不能为空"
        })
    }
    
    if(parent) {
        Tag.findById(parent, function(err, tag) {
            if(err) {
                return res.json({
                    success: false,
                    message: "标签创建失败",
                    err: err
                })
            }
            if(!tag) {
                return res.json({
                    success: false,
                    message: "标签创建失败(父标签不存在)"
                })
            }
            createTag();
        });
    } else {
        createTag();
    }

    function createTag(){
        var tag = new Tag();
        tag.name = name;
        if(parent) {
            tag.parent = parent;
        }
        tag.save(function (err, tag) {
            if(!err && tag) {
                if(parent) {
                    Tag.findById(parent, function(err, parentTag) {
                        parentTag.children.push(tag._id);
                        parentTag.save()
                    })
                }

                return res.json({
                    success: true,
                    message: "标签创建成功",
                    tag: tag
                })
            }else{
                return res.json({
                    success: false,
                    message: "标签创建失败",
                    err: err
                })
            }
        });
    }
});

route.get('/tags', requireAuth, requireAdmin, function(req, res) {
    Tag.find({}, function(err, tags){
        if (!err && tags) {
            return res.json({
                success: true,
                message: '获取标签成功',
                tags: tags
            });
        } else {
            return res.json({
                success: false,
                message: "获取标签失败",
                err: err
            })
        }
    })
})

route.get('/tagroot', requireAuth, requireAdmin, function(req, res) {
    Tag.find({parent: null}).select('_id name parent children').exec(function(err, tags){
        if (!err && tags) {
            return res.json({
                success: true,
                message: '获取标签成功',
                tags: tags
            });
        } else {
            return res.json({
                success: false,
                message: "获取标签失败",
                err: err
            })
        }
    })
})

module.exports = route;