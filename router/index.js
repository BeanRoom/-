var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('../config/passport');

router.get('/', function (req, res, next) {
    // 로그인 체크
    if(req.isAuthenticated()){
        res.render('index');
    }else{
        res.render('login');
    }
});

module.exports = router;