const Tag = require("../models/Tag");

module.exports = {
  addTag: async (req, res, next) => {
    const { name, parent } = req.body;
    if (!name) {
      return res.json({
        success: false,
        message: "必须填写标签名"
      });
    }

    let existTag = await Tag.find({
      name: name
    });
    if (existTag && existTag.length !== 0) {
      return res.json({
        success: false,
        message: "这个标签已经存在了"
      });
    }

    const userId = req.decoded.id;
    let tag = new Tag();
    tag.name = name;
    tag.user = userId;

    if (parent) {
      tag.parent = parent;
    }

    let newTag = await tag.save();
    return res.json({
      success: true,
      message: "添加标签成功",
      tag: newTag
    });
  },

  removeTag: async (req, res, next) => {
    const { id } = req.params;
    let removeTag = await Tag.findOneAndRemove({
      _id: id
    });
    if (removeTag) {
      return res.json({
        success: true,
        message: "标签删除成功"
      });
    } else {
      return res.json({
        success: false,
        message: "标签不存在"
      });
    }
  },

  getTags: async (req, res, next) => {
    let tags = await Tag.find({});
    return res.json({
      success: true,
      message: "获取标签列表成功",
      tags: tags
    });
  },

  getTag: async (req, res, next) => {
    const { id } = req.params;
    let tag = await Tag.findById(id);
    if (tag) {
      return res.json({
        success: true,
        message: "获取标签详情成功",
        tag: tag
      });
    } else {
      return res.json({
        success: false,
        message: "获取标签详情失败"
      });
    }
  },

  getChildren: async (req, res, next) => {
    const { id } = req.params;

    let tag = await Tag.findById(id);
    if (tag) {
      let tags = await Tag.find({
        parent: id
      });
      return res.json({
        success: true,
        message: "获取子标签成功",
        tags: tags
      });
    } else {
      return res.json({
        success: false,
        message: "此标签不存在"
      });
    }
  }
};
