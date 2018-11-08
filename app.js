// 모듈을 추출합니다.
var socketio = require('socket.io');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var http = require('http');
var fs = require('fs');
var passport= require('passport');

// app.use들 사이에 순서 바뀌면 오류날 수 있음

// bodyParser 세팅
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 세션
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

// passport 설정
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
app.use(express.static('public'));

require('./config/passport')(passport);
var flash = require('connect-flash');
app.use(flash());

// 몽고db 연결
mongoose.connect('mongodb://localhost/schoolapp',{ useNewUrlParser: true })
mongoose.Promise = global.Promise; 

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connnected to mongod server");
});

// 라우팅 설정
var index = require('./router/index');
app.use('/', index);

// /boards/ 로 들어오는 요청 contents.js에서 처리
var boards = require('./router/contents');
app.use('/boards', boards);

// 변수를 선언합니다.
var seats = [
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,], 
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1,],
];

// // 라우트를 수행합니다.
// app.get('/', function (request, response, next) {
//     response.redirect('/lab');
// });

// app.get('/lab', function (request, response, next) {
//     fs.readFile('sample.html', function (error, data) {
//         response.send(data.toString("utf-8"));
//     });
// });
// app.get('/lab/seats', function (request, response, next) {
//     response.send(seats);
// });

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
});

// 소켓 서버를 생성 및 실행합니다.
var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
    socket.on('reserve', function (data) {
        seats[data.y][data.x] = 2;
        console.log(seats[data.y][data.x]);
        io.sockets.emit('reserve', data);
    });
    socket.on('remove', function (data) {
        seats[data.y][data.x] = 1;
        console.log(seats[data.y][data.x]);
        io.sockets.emit('remove', data);
    });
});