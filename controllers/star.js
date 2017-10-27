const Star = require("../models/Star");

module.exports = {
  addStar: async (req, res, next) => {
    const { title, url } = req.body;
    if (!title) {
      return res.json({
        success: false,
        message: "必须填写标题"
      });
    }
    if (!url) {
      return res.json({
        success: false,
        message: "必须填写url"
      });
    }

    let existStar = await Star.find({ user: req.decoded.id, url: url });
    if (existStar && existStar.length !== 0) {
      return res.json({
        success: false,
        message: "这个地址你已经收藏过了"
      });
    }

    let star = new Star();
    star.title = title;
    star.url = url;
    star.user = req.decoded.id;

    let newStar = await star.save();
    return res.json({
      success: true,
      message: "添加收藏成功",
      star: newStar
    });
  },

  getPublicStars: async (req, res, next) => {
    let stars = await Star.find({ public: true });
    return res.json({
      success: true,
      message: "获取收藏成功",
      stars: stars
    });
  },

  getMyStars: async (req, res, next) => {
    let stars = await Star.find({ user: req.decoded.id }, null, {
      sort: { visits: -1, updated: -1 }
    });
    return res.json({
      success: true,
      message: "获取收藏成功",
      stars: stars
    });
  },

  patchVisits: async (req, res, next) => {
    let star = await Star.findByIdAndUpdate(
      req.params.id,
      { $inc: { visits: 1 } },
      { new: true }
    );
    return res.json({
      success: true,
      message: "更新成功",
      star: star
    });
  }
};
