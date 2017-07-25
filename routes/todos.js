const router = require('express-promise-router')();
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

const TodoController = require('../controllers/todo');

// 添加待办
router.post('/', requireAuth, TodoController.addTodo);

// 获取我的待办
router.get('/', requireAuth, TodoController.getTodosByPage);

// [管理后台]-获取待办列表
router.get('/admin', requireAuth, requireAdmin, TodoController.getTodosByAdmin);

// 修改待办状态
router.patch('/:id/status', requireAuth, TodoController.updateTodoStatus);

// 修改待办详情
router.patch('/:id/thing', requireAuth, TodoController.updateTodoThing);

// 删除待办
router.delete('/:id', requireAuth, TodoController.deleteTodo);

module.exports = router;