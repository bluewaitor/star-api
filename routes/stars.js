const router = require('express-promise-router')();
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

const StarController = require('../controllers/star');

/**
 * 添加收藏
 */
router.post('/', requireAuth, StarController.addStar);

/**
 * 获取公开收藏
 */
router.get('/', requireAuth, StarController.getPublicStars);

/**
 * 获取自己的收藏
 */
router.get('/me', requireAuth, StarController.getMyStars);

/**
 * 更新访问次数
 */
router.patch('/:id', requireAuth, StarController.patchVisits);


module.exports = router;