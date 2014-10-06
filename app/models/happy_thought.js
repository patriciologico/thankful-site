var mongoose = require('mongoose');


var happyThought = mongoose.Schema({

    user_id    : String,
    content    : String,
    created_at : Date,
    updated_at : Date

});

module.exports = mongoose.model('HappyThought', happyThought);