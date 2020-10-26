
require('dotenv').config();
const path = require('path');
const { engine } = require('express-edge');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
// to flash massage when the try to submit errors input
const connectFlash = require("connect-flash");
const edge = require('edge.js')


// controller files
const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const getPostController = require('./controllers/getPost');
const storePostController = require('./controllers/storePost');

const createUserController = require('./controllers/createUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

// import formValidation middleware
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');
const storePost = require("./middleware/storePost");
const auth = require("./middleware/auth");

// storing session in mongobd Database
const mongoStore = connectMongo(expressSession);

const app = new express();
// express-session package
app.use(expressSession({
    secret: 'secret',
    // storing session in mongobd Database 
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// to flash massage when the try to submit errors input
app.use(connectFlash());

app.use(fileUpload());
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(engine)
app.set('views', __dirname + '/views');

// this is the app.edge file from the views folder
app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});


// body-parser code
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// form Validation middleware
app.use('/posts/store', storePost);

// All Routes
app.get("/", homePageController);
app.get("/post/:id", getPostController);

app.get("/posts/new", auth, createPostController);
app.post("/posts/store", auth, storePost, storePostController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.get("/auth/register", redirectIfAuthenticated, createUserController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);
app.get("/auth/logout", redirectIfAuthenticated, logoutController);


// db-blog-one-12345
// Mongodb database connection
const dbURL = process.env.MONGOBD_URL;
mongoose.connect(dbURL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, error => {
    if (error) {
        console.log("Connection to MongoDB Database failed", error)
    } else {
        console.log("You are successfully connected to MongoDB Database")
    }
})


const PORT = 4000;
app.listen(PORT, () => {
    console.log("app is listening on port: " + PORT);
})