const router = require('express-promise-router')();

const AccountController = require('../controllers/account');

// 用户注册
router.post('/signup', AccountController.signup);

// 用户登录
router.post('/login', AccountController.login);

module.exports = router;