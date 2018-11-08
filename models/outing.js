var mongoose = require('mongoose');

var outingSchema = mongoose.Schema({
    user_id : String,
    starttime : String,
    stoptime : String,
    why : String
});

module.exports = mongoose.model('outing', outingSchema);