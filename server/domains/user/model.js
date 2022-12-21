const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender : { type: String, required: true },
    rating:{ type: Number, default: 0 },
    is_host:{ type: Boolean, required: true },
    rsvp_d:Array,
    events:Array,
    reviews:Array,
    comments:Array,
    reviews_upvoted:Array,
    reviews_downvoted:Array,
    comments_upvoted:Array,
    comments_downvoted:Array,
    verified: { type: Boolean, required: true }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;