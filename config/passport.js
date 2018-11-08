var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user');
var Student = require('../models/student');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    //프로그램 작성

    passport.use('signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ 'email' : email }, function(err, user) {
            if (err) return done(err);
            if (user) {
                console.log("이메일 존재");
                return done(null, false, req.flash('signupMessage', '이메일이 존재합니다.'));
            } else {
                var newUser = new User();
                newUser.name = req.body.name;
                newUser.email = email;
                //newUser.password = password; 
                newUser.password = newUser.generateHash(password); 
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    console.log("저장 완료"+toString(newUser));
                    return done(null, newUser);
                });
                newStudent = new Student();
                newStudent.user_id = newUser.id;
                newStudent.grade = req.body.grade;
                newStudent.class = req.body.class;
                newStudent.number = req.body.number;
                newStudent.name = req.body.name;

                newStudent.save(function(err){
                    if(err)
                        throw err;
                    console.log("학생 저장 완료");
                });
            }
        });
    }));

    passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { 
        User.findOne({ 'email' : email }, function(err, user) {
            if (err)
                return done(err);
            if (!user){
                console.log("사용자 찾을 수 없음");
                return done(null, false, req.flash('loginMessage', '사용자를 찾을 수 없습니다.'));
            }
            if (!user.validPassword(password)){
                console.log("비번다름");
                return done(null, false, req.flash('loginMessage', '비밀번호가 다릅니다.')); 
            }
            console.log("로그인 성공");
            return done(null, user);
        });
    }));
};