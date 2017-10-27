const User = require("../models/User");

module.exports = {
  signup: async (req, res, next) => {
    let { username, password } = req.body;
    if (!username) {
      return res.json({
        success: false,
        message: "用户名不能为空"
      });
    }
    if (!password) {
      return res.json({
        success: false,
        message: "密码不能为空"
      });
    }
    if (password.length < 6) {
      return res.json({
        success: false,
        message: "密码至少6位"
      });
    }

    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(400).send({ success: false, message: "该用户已存在" });
    }
    const user = new User({ username, password });
    const newUser = await user.save();

    const token = newUser.generateToken();
    if (token) {
      res.json({ success: true, message: "注册成功", token: token });
    }
  },

  login: async (req, res, next) => {
    let { username, password } = req.body;

    if (!username) {
      return res.json({
        success: false,
        message: "用户名不能为空"
      });
    }
    if (!password) {
      return res.json({
        success: false,
        message: "密码不能为空"
      });
    }

    let user = await User.findOne({ username: username });

    if (!user) {
      return res.json({
        success: false,
        message: "用户不存在"
      });
    }
    user.comparePassword(password, async (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          success: false,
          message: "密码错误"
        });
      } else {
        const token = user.generateToken();
        if (token) {
          return res.json({
            success: true,
            message: "给你token",
            token: token
          });
        }
      }
    });
  }
};
