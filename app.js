const express = require("express");
const bodyParser = require("body-parser");
//const Post = require("./models/post");
const path = require("path");
const staticAsset = require("static-asset"); //add hash for static
const config = require("./config");
const mongoose = require("mongoose");
const routes = require('./routes');
/** for session **/
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//database
mongoose.Promise = global.Promise;
mongoose.set("debug", !config.IS_PRODUCTION);
mongoose.connection
    .on("error", error => console.error(error))
    .on("close", () => console.log("Database connection closed."))
    .once("open", () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
        // require('./mocks')();
    });
mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);
//express
const app = express();

app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
);

//sets and uses
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    "/javascripts",
    express.static(path.join(__dirname, "node_modules", "jquery", "dist"))
);

//routes
app.get("/", (req, res) => {
    const id = req.session.userId;
    const login = req.session.userLogin;
    res.render("index", {
        user: {
            id,
            login
        }
    });
});
app.use('/api/auth', routes.auth);
app.use('/post', routes.post);

//catch 404 and forward to error handler
app.use((req,res, next) => {
    const err = new Error('Not found');
    err.status = 404;
       next(err);
});

//error handler

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: !config.IS_PRODUCTION ? error : ''
    });
});

app.listen(config.PORT, () =>
    console.log("server start port " + config.PORT)
);
