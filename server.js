var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var publicRoutes = require('./routes/publicRoutes');
var privateRoutes = require('./routes/privateRoutes');

mongoose.connect('mongodb://localhost:27017/star');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use("/api", publicRoutes);
app.use("/api", privateRoutes);


app.listen(PORT, function() {
    console.log('app running at port ' + PORT);
});