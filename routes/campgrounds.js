var express = require("express");
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');


// INDEX route - show all data

router.get("/", function(req, res){
    Campground.find({}, function(err, AllCampgrounds){
      if(err){
        console.log(err);
      } else {
        res.render("campground/index", {campgrounds:AllCampgrounds});
      }
    });
});

// CREATE route - add new item to the db
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var descr = req.body.descr;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newCamp = {name: name, image: image, descr: descr, author: author};
    console.log(req.user);
    Campground.create(newCamp, function(err, campground){
        if(err){
          console.log(err);
        } else {
          console.log("Newly created campground:");
          console.log(campground);
          res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to add new item to the db
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campground/new");
});

//SHOW - shows more info about campgrounds
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamground){
        if(err){
          console.log(err);
        } else {
          console.log("Rendered campground:");
          console.log(foundCamground);
          res.render("campground/show", {campground:foundCamground});
        }
    });
});

//EDIT - Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamground){
        res.render("campground/edit", {campground:foundCamground});
    });
});

//UPDATE - Campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DELETE - Campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   // remove comments
   Campground.findById(req.params.id, function(err, foundCampground){
      if (err) {
         console.error(err);
      } else {
         // Remove associated comments
         var foundComments = foundCampground.comments;
         foundComments.forEach(function(commentID){
            Comment.findByIdAndRemove(commentID, function(err){
               if(err) {
                  console.log("Error removing comment: " + err);
               }
            });
         });

         // Remove campground
         foundCampground.remove(req.params.id, function(err, campground){
            console.log("removing campground: " + campground.name);
            if (err) {
               res.redirect("/campgrounds");
            } else {
               res.redirect("/campgrounds/");
            }        
         });
      }      
   });
});

module.exports = router;