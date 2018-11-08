// 상점 스키마
var mongoose = require('mongoose');

var greenPointSchema = mongoose.Schema({
    user_id : String,
    point : Number,
    why : String
});

module.exports = mongoose.model('greenPoint', greenPointSchema);