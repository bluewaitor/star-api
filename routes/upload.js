const router = require("express-promise-router")();
const requireAuth = require("../middlewares/requireAuth");
// const requireAdmin = require('../middlewares/requireAdmin');

const UploadController = require("../controllers/upload");

// 上传图片
router.get("/avatar", UploadController.avatar);
router.post("/callback", UploadController.callback);

module.exports = router;
