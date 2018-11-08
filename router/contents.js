var express = require('express');
var router = express.Router();
var BoardContents = require('../models/board');

router.get('/', function(req,res){
    // 게시판 메인 페이지
    // 게시글 리스트 출력
    
    BoardContents.find({}).sort({date:-1}).exec(function(err,rawContents){
        if(err) throw err;

        res.render('boards',{
            contents: rawContents
        });
    });
});

module.exports = router;