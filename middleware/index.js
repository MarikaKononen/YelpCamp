var Campground = require("../models/campground");
var Comment    = require("../models/comment");

// all middeware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
     // is user logged in
    if(req.isAuthenticated()){
            
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err){
                res.redirect("/campgrounds");
            } else {
                 // does user own the campground?
                // campground.author.id => mongoose object
                // req.user._id => string, comparing those needs equals
                if(foundCampground.author.id.equals(req.user._id)){
                    next()
                } else {
                    res.redirect("back");
                }   
            }
        });
    } else {
         console.log("You need to be logged in to do that.");
        res.redirect("back");
    }          
}



middlewareObj.checkCommentsOwnership = function(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                res.redirect("/campgrounds");
            } else {
                // does user own the comment?
                // comment.author.id => mongoose object
                // req.user._id => string, comparing those needs equals
                if(foundComment.author.id.equals(req.user._id)){
                    next()
                } else {
                    res.redirect("back");
                }   
            }
        });
    } else {
        console.log("You need to be logged in to do that.");
        res.redirect("back");
    }  
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;