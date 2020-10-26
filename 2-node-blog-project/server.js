
require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const articlesRouter = require("./routes/articles");
const Article = require("./models/article");
const methodOverride = require("method-override");


// The use middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
// app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: false // this should alway be set to false
}));
// This is to override to form GET and POST to use DELETE or PUT also.
app.use(methodOverride('_method'));


// all routers here

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/index', { 
        articles: articles
    })
});

app.use('/articles', articlesRouter);



// MongoDB database Connection setup
const dbURL = process.env.MONGODB_URL;
mongoose.connect(dbURL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, error => {
    if (error) {
        console.log("Connection to MongoDB Database failed", error); 
    } else {
        console.log("You are successfully connected to MongoDB Database");
    }
});


const PORT_URL = process.env.PORT;
app.listen(PORT_URL, () => {
    console.log("app is listening on port: " + PORT_URL);
})

