const router = require('express-promise-router')();
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

const TodoController = require('../controllers/todo');

router.post('/', requireAuth, TodoController.addTodo);
router.get('/', requireAuth, TodoController.getTodosByPage);
router.get('/admin', requireAuth, requireAdmin, TodoController.getTodosByAdmin);
router.patch('/:id/status', requireAuth, TodoController.updateTodoStatus);
router.patch('/:id/thing', requireAuth, TodoController.updateTodoThing);

module.exports = router;