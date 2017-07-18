const router = require('express-promise-router')();
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

const UserController = require('../controllers/user');

router.get('/me', requireAuth, UserController.getSelfInfo);
/**
 * 修改密码
 */
router.put('/password', requireAuth, UserController.updatePassword);

/**
 * 修改性别
 */
router.put('/gender', requireAuth, UserController.updateGender);

/**
 * 获取所有用户
 */
router.get("/", requireAuth, requireAdmin, UserController.getAllUser);

module.exports = router;