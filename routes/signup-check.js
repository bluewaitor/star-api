const router = require('express-promise-router')();

const signupCheckController = require('../controllers/signup-check.js');
/**
 * 检查用户名
 */
router.post('/username', signupCheckController.username);

/**
 * 检查邮箱
 */
router.post('/email', signupCheckController.email);

/**
 * 检查密码
 */
router.post('/password', signupCheckController.password);

module.exports = router;