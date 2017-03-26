var Tag = require('../../models/Tag');
module.exports = {
    addTag: function (req, res) {
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
    },
    getTags: function(req, res) {
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
    },
    getTagsTree: function(req, res) {
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
    }
}