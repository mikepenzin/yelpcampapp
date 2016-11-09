var middlewareObj = {};
var Campground = require('../models/campground');
var Comment = require('../models/comment');

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamground){
          if(err){
            console.log(err);
            req.flash("error", "Something whent wrong :(");
            res.redirect("back");
          } else {
            if(foundCamground.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "Something whent wrong :(");
                res.redirect("back");
            }    
          }
        });
        
    } else {
        req.flash("error", "You need to be loggedin to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err){
            req.flash("error", "Something whent wrong :(");
            console.log(err);
            res.redirect("back");
          } else {
            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "Something whent wrong :(");
                res.redirect("back");
            }    
          }
        });
    } else {
        req.flash("error", "You need to be loggedin to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;