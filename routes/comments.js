var express = require("express");
var router  = express.Router({mergeParams: true});
var Myalbum = require("../models/myalbum");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find Myalbum by id
    console.log(req.params.id);
    Myalbum.findById(req.params.id, function(err, myalbum){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {myalbum: myalbum});
        }
    })
});

//Comments Create
router.post("/", middleware.isLoggedIn ,function(req, res){
   //lookup Myalbum using ID
   Myalbum.findById(req.params.id, function(err, myalbum){
       if(err){
           console.log(err);
           res.redirect("/myalbum");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               
               myalbum.comments.push(comment);
               myalbum.save();

            //    console.log("!!!!!!! ADD CMTTT   !!!!!!!!!!!!!!!!!!!!!!!");
            //    console.log(myalbum);
                req.flash('success', 'Created a comment!');
               res.redirect('/myalbum/' + myalbum._id);


               //save comment
            //    comment.save();
            //    myalbum.comments.push(comment);

            //    myalbum.save();
            //    console.log(comment);
            //    req.flash('success', 'Created a comment!');
            //    res.redirect('/myalbum/' + myalbum._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // find Myalbum by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {myalbum_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
           res.render("edit");
       } else {
           res.redirect("/myalbum/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
            res.redirect("/myalbum/" + req.params.id);
        }
    })
});

module.exports = router;