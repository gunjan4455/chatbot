const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        default : ""
    },
    status : {
        type : String,
        default: "offline"
    },
    userid : {
        type : Number
    },
    password : {
        type: String
    },
    isAdmin: {
        type: Boolean
    },
    socketId: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('User', UserSchema);
