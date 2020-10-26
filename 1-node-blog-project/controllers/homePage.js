

// DB models
const Post = require('../database/models/Post');


// Home route
module.exports = async (req, res) => {
    const posts = await Post.find({});

    res.render("index", {
        posts
    });
}