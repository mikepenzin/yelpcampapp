var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require('../middleware');


//NEW - show form to add new comment/review
router.get('/new', middleware.isLoggedIn,  function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
      if(err){
        console.log(err);
      } else {
        res.render("comments/new", {campground: campground});
      }
    });
});

// CREATE route - add new comment/review to relevant campground
router.post('/', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        //create new comment
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
          } else {
            //add useraname and id to comments
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            //connect new comment to campground
            comment.save();
            campground.comments.push(comment);
            campground.save();
            console.log("Created new comment" + comment);
            //redirect to campground
            res.redirect("/campgrounds/" + campground._id);
          }
        });
      }
    });
});

// EDIT route - edit comment/review
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamground){
        if(err){
          console.log(err);
        } else {
        Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err){
            console.log(err);
          } else {
            console.log("==============================");
            console.log("comment:" + foundComment);
            console.log("==============================");
            console.log(foundCamground);
            console.log("==============================");
            res.render("comments/edit", {campground: foundCamground, comment:foundComment});
          }
        });
      }
    }); 
});

//UPDATE Comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DELETE Comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   // remove comments
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if (err) {
         req.flash("error", "Something whent wrong :(");
         console.error(err);
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }        
   });
});


module.exports = router;