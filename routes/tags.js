const router = require("express-promise-router")();
const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");

const TagController = require("../controllers/tag");

// 添加标签
router.post("/", requireAuth, TagController.addTag);

// 获取标签列表
router.get("/", requireAuth, TagController.getTags);

// 获取标签
router.get("/:id", requireAuth, TagController.getTag);

// 获取子标签
router.get("/:id/children", requireAuth, TagController.getChildren);

// 删除标签
router.delete("/:id", requireAuth, TagController.removeTag);

module.exports = router;
