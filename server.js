var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var timestampPlugin = require('@bluewaitor/mongoose-plugin-timestamp');
mongoose.plugin(timestampPlugin, {index: true});
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


app.listen(PORT, function() {
    console.log('app running at port ' + PORT);
});