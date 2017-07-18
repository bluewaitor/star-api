const router = require('express-promise-router')();
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

const ArticleController = require('../controllers/article');

router.route('/')
    .get(ArticleController.getPublishArticlesByPage)
    .post(requireAuth, ArticleController.addArticle);

router.get('/dashboard', requireAuth, requireAdmin, ArticleController.getArticlesByAdmin);

router.route('/me')
    .get(requireAuth, ArticleController.getArticleByUserId);

router.route('/:id')
    .get(ArticleController.getArticleById)
    .put(requireAuth, ArticleController.updateArticle);


router.post('/comments', requireAuth, ArticleController.addComment);

module.exports = router;