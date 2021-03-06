

const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    username: String,
    image: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
});



module.exports = mongoose.model('Posts', PostSchema);


