const router = require('express-promise-router')();

const AccountController = require('../controllers/account');

router.route('/login')
    .post(AccountController.login);

router.route('/signup')
    .post(AccountController.signup);

module.exports = router;