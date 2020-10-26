

const bcrypt = require('bcrypt');
const User = require('../database/models/User');


module.exports = (req, res) => {
    const { email, password } = req.body;

    // finding the user
    User.findOne({
        email
    }, (error, user) => {
        if (user) {
            // if any user exist, then we compare the user
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    // we are saving the to the browser session
                    req.session.userId = user._id
                    // if that user exist in our database, we will login them into the blog
                    res.redirect('/')
                } else {
                    res.redirect('/auth/login')
                }
            })
        } else {
            return res.redirect('/auth/login')
        }
    })
}