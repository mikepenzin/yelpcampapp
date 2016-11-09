var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {
            name: "Brooks River Range",
            image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Biskeri-_Camping_I_IMG_7238.jpg",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis, ipsum vitae semper maximus, augue magna interdum ex, sed eleifend leo magna nec enim. Pellentesque varius quam a suscipit gravida. "
        },
        {
            name: "Biskeri Camping",
            image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Camping_on_unnamed_lake_in_Brooks_Range.jpg",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis, ipsum vitae semper maximus, augue magna interdum ex, sed eleifend leo magna nec enim. Pellentesque varius quam a suscipit gravida. "
        },
        {
            name: "Yosemite Heights",
            image: "http://cdn.history.com/sites/2/2015/09/Yosemite-E.jpeg",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis, ipsum vitae semper maximus, augue magna interdum ex, sed eleifend leo magna nec enim. Pellentesque varius quam a suscipit gravida."
        }
    ];

var commentExample = [
        {
            text: "This place is great, I wish I had this before a trip!",
            author: "Homer"
        },
        {
            text: "blah blah blah",
            author: "CrazyAss Traveler"
        },
    ];
    
    
function seedDB(){
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if (err){
            console.lo(err);
        } else {
            console.log('removed all campgrounds!');
            // add a few campgrounds
                data.forEach(function(seed){
                    Campground.create(seed, function(err, campground){
                        if (err){
                            console.log(err);
                        } else {
                            console.log("Added a campground!");
                            
                            // add comments
                            
                            Comment.create(
                                {
                                    text: "This place is great, I wish I had this before a trip!",
                                    author: "Homer"
                                }, function(err, comment){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("Created new comment");
                                    }
                                });
                        }
                    });
                });
        }
    });
}

module.exports = seedDB;