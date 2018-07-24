var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session=require("express-session")({
  secret:'keyboard cat',
  cookie:{maxAge:800000}
});

var iosession=require("express-socket.io-session")(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//app server io(socket.io)
var server=require("http").Server(app);
var io=require("socket.io")(server)
server.listen(3000);
// view engine setup

//////////////////////////////////////////////////////////////////////////////////////////
io.use(iosession);
io.on("connection",function(socket){
  socket.on("req",function(data,cb){
    console.log("receive req")
    cb();
  })
  socket.on("say",data=>{

    const socketuser= socket.handshake.session.user
    // const userNA=socket.handshake.session.user[loginname]
    socket.handshake.session.save();
    if(socketuser){
    io.emit("newsay",data+'     user:   '+socketuser.loginname)}
      // io.emit(console.log(socketuser))
    // io.emit("newsay",data + new Date())

  })
})

//////////////////////////////////////////////////////////////////////////////////////////

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
