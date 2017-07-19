const Todo = require('../models/Todo');

module.exports = {
    addTodo: async (req, res, next) => {
        const userId = req.decoded.id;
        let {thing} = req.body;

        if (!thing) {
            return res.json({
                success: false,
                message: "待办不能为空"
            })
        }

        let newTodo = new Todo();
        newTodo.thing = thing;
        newTodo.user = userId;
        let todo = await newTodo.save();
        if (todo) {
            return res.json({
                success: true,
                message: '创建待办成功',
                todo: todo
            })
        }
    },

    getTodosByPage: async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const status = Number(req.query.status) || 0;
        const userId = req.decoded.id;
        let todos = await Todo.paginate({user: userId, status: status}, {page: page, limit: limit, sort: '-created'});
        if (todos) {
            return res.json({
                success: true,
                message: '获取待办事项成功',
                todos: todos
            })
        }
    },

    getTodosByAdmin: async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        let todos = await Todo.paginate({}, {page: page, limit: limit, sort: '-created', populate: {path: 'user', select: 'username'}});
        if (todos) {
            return res.json({
                success: true,
                message: '获取待办事项成功',
                todos: todos
            })
        }
    },

    updateTodoStatus: async (req, res, next) => {
        const {id} = req.params;
        let {status} = req.body;
        const userId = req.decoded.id;

        let todo = await Todo.findOneAndUpdate({_id: id, user: userId}, {status: status}, {new: true});
        if (todo) {
            return res.json({
                success: true,
                message: '修改状态成功',
                todo: todo
            })
        } else {
            return res.json({
                success: false,
                message: '你不是该待办的所有者'
            })
        }

    },

    updateTodoThing: async (req, res, next) => {
        const {id} = req.params;
        let {thing} = req.body;
        const userId = req.decoded.id;

        if (!thing) {
            return res.json({
                success: false,
                message: "待办不能为空"
            })
        }
        let todo = await Todo.findOneAndUpdate({_id: id, user: userId}, {thing: thing}, {new: true});
        if (todo) {
            return res.json({
                success: true,
                message: '修改待办成功',
                todo: todo
            })
        } else {
            return res.json({
                success: false,
                message: '你不是该待办的所有者'
            })
        }

    }
};