var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var User = require('./models/User');
mongoose.connect('mongodb://localhost:27017/star');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

app.post('/signup', function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.save(function(err) {
        if(err) {
            throw err;
        }
        res.json({
            "message": "signup success",
            "code": 200
        })
    })
});


app.listen(PORT, function(req, res) {
    console.log('app running at port ' + PORT);
});