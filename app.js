var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var googleAuth = require('./routes/googleUsers');
var facebookAuth = require('./routes/facebookUsers');
var discussionRouter = require('./routes/discussions');
var messageRouter = require('./routes/messages');
var stripeRouter = require('./routes/stripe');

var app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);


const CONNECTION_URL = 'mongodb+srv://aymenelouaer97:qSCsZbsoYK6VV0OA@cluster0.qmwmrkv.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

io.on('connection', function (socket) {
  console.log('User connected:', socket.id);
  joinRoom(socket, io);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', googleAuth);
app.use('/auth', facebookAuth);
app.use('/discussions', discussionRouter);
app.use('/', messageRouter);
app.use('/stripe', stripeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;