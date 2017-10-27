const router = require("express-promise-router")();
const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");

const UserController = require("../controllers/user");

// 获取我的信息
router.get("/me", requireAuth, UserController.getSelfInfo);

// 修改用户密码
router.put("/password", requireAuth, UserController.updatePassword);

// 修改用户性别
router.put("/gender", requireAuth, UserController.updateGender);

// [管理后台]-获取所有用户
router.get("/", requireAuth, requireAdmin, UserController.getAllUser);

module.exports = router;
