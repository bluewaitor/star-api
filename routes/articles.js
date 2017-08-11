const router = require('express-promise-router')();
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

const ArticleController = require('../controllers/article');

// 获取前台首页文章列表
router.get('/', ArticleController.getPublishArticlesByPage);

// [管理后台]-获取文章列表
router.get('/dashboard', requireAuth, requireAdmin, ArticleController.getArticlesByAdmin);

// 获取我的文章列表
router.get('/me', requireAuth, ArticleController.getArticleByUserId);

// 添加文章
router.post('/', requireAuth, ArticleController.addArticle);

// 获取文章
router.get('/:id', ArticleController.getArticleById);

// 修改文章
router.put('/:id', requireAuth, ArticleController.updateArticle);

// 添加评论
router.post('/comments', requireAuth, ArticleController.addComment);

module.exports = router;