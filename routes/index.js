var express                 = require("express");
var router                  = express.Router();
var passport                = require("passport");
var User                    = require('../models/user');



//root route
router.get("/", function(req, res){
    res.redirect("/campgrounds");
});

//NEW - show form to register new user
router.get("/register", function(req, res){
    res.render("register");
});

//CREATE - register new user
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register",{"error": err.message});
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Yay! You just successfully Signed Up! Nice to meet you " + req.body.username);
                res.redirect("/campgrounds"); 
            });
        }
    });
});

//SHOW - Login form
router.get("/login", function(req, res){
    res.render("login");    
});

//LOGIN to system - middleware
router.post("/login", passport.authenticate("local", {
       successRedirect: "/campgrounds",
       failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;