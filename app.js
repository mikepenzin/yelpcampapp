var bodyParser              = require("body-parser"),
    mongoose                = require('mongoose'),
    methodOverride          = require('method-override'),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    flash                   = require("connect-flash"),
    User                    = require('./models/user'),
    compression             = require('compression'),
    express                 = require("express"),
    app                     = express();




app.use(compression(9));

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

// console.log(process.env.DATABASEURL);
// If process.env.DATABASEURL = undefined - need to perform:
// export DATABASEURL=mongodb://localhost/yelp_camp

mongoose.connect(process.env.DATABASEURL);

app.use(express.static(__dirname + "/public", { maxAge: 86400000 }));
// to not use .ejs ending
app.set("view engine","ejs");

//method override
app.use(methodOverride("_method"));


//tell express to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//app to use flash
app.use(flash());

//=========================
// Passport configuration
//=========================

app.use(require("express-session")({
    secret: "We made it!",
    resave: false,
    saveUninitialized: false
}));

//for Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//=========================
// END - Passport configuration
//=========================

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// app.get("*", function(req, res){
//     res.send("Not what we expected :(");
// });


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("=========================");
    console.log("YelpCamp Server has started!");
    console.log("=========================");
});