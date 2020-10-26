

// DB models
const Post = require("../database/models/Post");


// single blog post
module.exports = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("post", {
        post
    });
}