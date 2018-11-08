// 학생 정보 스키마
// user_id에는 user정보의 _id가 담김
var mongoose = require('mongoose');

var studnetSchema = mongoose.Schema({
    user_id : String,
    grade : String,
    class : String,
    number : String,
    name : String
});

module.exports = mongoose.model('student',studnetSchema);