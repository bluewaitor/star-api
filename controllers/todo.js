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
        let todos = await Todo.paginate({status: status}, {page: page, limit: limit, sort: '-created'});
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
        let todo = await Todo.findByIdAndUpdate(id, {status: status}, {new: true});
        return res.json({
            success: true,
            message: '修改状态成功',
            todo: todo
        })
    },

    updateTodoThing: async (req, res, next) => {
        const {id} = req.params;
        let {thing} = req.body;
        if (!thing) {
            return res.json({
                success: false,
                message: "待办不能为空"
            })
        }
        let todo = await Todo.findByIdAndUpdate(id, {thing: thing}, {new: true});
        return res.json({
            success: true,
            message: '修改待办成功',
            todo: todo
        })
    }
};