var express = require("express");
var multer = require('multer');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({ storage : storage}).single('image');


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
     upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file." + err);
        }
        //get data from form and add to campgrounds array
        var name = req.body.name;
        var image = '/uploads/' + req.file.filename;
        var descr = req.body.descr;
        var author = {
            id: req.user._id,
            username: req.user.username
        };
        var newCampground = {name: name, image: image, descr: descr, author: author};
        //Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else{
                //redirect back to campgrounds page
                res.redirect("/campgrounds");       
            }
        });
     });
});

//     upload(req,res,function(err) {
//         if(err) {
//             return res.end("Error uploading file."); 
//         }
//     //get data from form and add to campgrounds array
//     var name = req.body.name;
//     var image = '/uploads/' + req.file.filename;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newCamp = {name: name, image: image, descr: descr, author: author};
//     console.log(req.user);
//     Campground.create(newCamp, function(err, campground){
//         if(err){
//           console.log(err);
//         } else {
//           console.log("Newly created campground:");
//           console.log(campground);
//           res.redirect("/campgrounds");
//         }
//     });
// });

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