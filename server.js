const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const timestampPlugin = require('@bluewaitor/mongoose-plugin-timestamp');
const mongoosePaginate = require('mongoose-paginate');

// 数据库
mongoose.Promise = global.Promise;
mongoose.plugin(timestampPlugin, {index: true});
mongoose.plugin(mongoosePaginate);
mongoose.connect('mongodb://localhost:27017/star', {useMongoClient: true});

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

// 路由
const account = require('./routes/account');
const signupCheck = require('./routes/signup-check');
const users = require('./routes/users');
const articles = require('./routes/articles');
const stars = require('./routes/stars');
const todos = require('./routes/todos');
app.use('/account', account);
app.use('/signup_check', signupCheck);
app.use('/users', users);
app.use('/articles', articles);
app.use('/stars', stars);
app.use('/todos', todos);

// 404 错误
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    res.status(status).json({
        success: false,
        message: error.message,
    });

    console.error(err);
});

// 开始
server.listen(PORT, () => {
    console.log('app running at port ' + PORT);
});

// io.on('connection', (socket) => {
//     console.log('connection');
//     socket.emit('message', {hello: 'world'});
//
//     socket.on('message', (data) => {
//         console.log(data);
//     });
// });


