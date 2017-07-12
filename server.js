var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var timestampPlugin = require('@bluewaitor/mongoose-plugin-timestamp');
var mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = global.Promise;
mongoose.plugin(timestampPlugin, {index: true});
mongoose.plugin(mongoosePaginate);
var cors = require('cors');

var publicRoutes = require('./routes/publicRoutes');
var privateRoutes = require('./routes/privateRoutes');

mongoose.connect('mongodb://localhost:27017/star');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

publicRoutes(app);
privateRoutes(app);

server.listen(PORT, function() {
    console.log('app running at port ' + PORT);

});

io.on('connection', function (socket) {
    console.log('connection');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('message', function(data) {
    console.log(data);
  })
});


