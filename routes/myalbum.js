var express = require("express");
var router  = express.Router();
var Myalbum = require("../models/myalbum");
var middleware = require("../middleware");
var request = require("request");

//INDEX - show all Myalbum
router.get("/", function(req, res){
    // Get all Myalbum from DB
    Myalbum.find({}, function(err, allAlbum){
       if(err){
           console.log(err);
       } else {
           request('https://maps.googleapis.com/maps/api/geocode/json?address=sardine%20lake%20ca&key=AIzaSyBtHyZ049G_pjzIXDKsJJB5zMohfN67llM', function (error, response, body) {
            if (!error && response.statusCode == 200) {
               // console.log(body); // Show the HTML for the Modulus homepage.
                res.render("myalbum/index",{myalbum:allAlbum});

            }
});
       }
    });
});

//CREATE - add new myalbum to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to myalbum array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newMyalbum = {name: name, image: image, description: desc, author:author}
    // Create a new album and save to DB
    Myalbum.create(newMyalbum, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to myalbum page
          //  console.log(newlyCreated);
            res.redirect("/myalbum");
        }
    });
});

//NEW - show form to create new myalbum
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("myalbum/new"); 
});

// SHOW - shows more info about one myalbum
router.get("/:id", function(req, res){
    //find the myalbum with provided ID
    Myalbum.findById(req.params.id).populate("comments").exec(function(err, foundMyalbum){
        if(err){
            console.log(err);
        } else {
           // console.log(foundMyalbum)
            //render show template with that myalbum
            res.render("myalbum/show", {myalbum: foundMyalbum});
        }
    });
});

router.get("/:id/edit", middleware.checkUserMyalbum, function(req, res){
    //console.log("IN EDIT!");
    //find the myalbum with provided ID
    Myalbum.findById(req.params.id, function(err, foundMyalbum){
        if(err){
            console.log(err);
        } else {
            //render show template with that myalbum
            res.render("myalbum/edit", {myalbum: foundMyalbum});
        }
    });
});

// router.get("/:id/edit", middleware.checkUserMyalbum, function(req, res){
//     //console.log("IN EDIT!");
//     //find the myalbum with provided ID
//     Myalbum.findById(req.params.id, function(err, foundMyalbum){
//         if(err){
//             console.log(err);
//         } else {
//             foundMyalbum.populate('comments').exec(function(err, popalbum){
//                 console.log(popalbum);
//                 res.render("myalbum/edit", {myalbum: popalbum});
//             })
//             //render show template with that myalbum
//             //res.render("myalbum/edit", {myalbum: foundMyalbum});
//         }
//     });
// });


router.put("/:id", function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.desc};
    Myalbum.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, myalbum){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/myalbum/" + myalbum._id);
        }
    });
});


router.delete("/:id", function(req, res){
    Myalbum.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Deleted!");
            res.redirect("/myalbum");
        }
    });
});

//middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "signed in to do that!");
//     res.redirect("/login");
// }

module.exports = router;

