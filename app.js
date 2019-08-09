let express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");
 
var ObjectId = require('mongodb').ObjectID;

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String, 
    description: String
});

let Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://images.unsplash.com/photo-1559521783-1d1599583485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
//         description: "This is a huge granite hill, no bathrooms, no water."
//     },
//     function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created campground: ");
//             console.log(campground);
//         }
//     }

// );

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX route - show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds})
        }
    });
});

// CREATE route - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form 
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    var newCampground = {name: name, image:image, description:desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW route - show for to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs")
});

// SHOW route - shows info about one campground
app.get("/campgrounds/:id", function(req, res){
    // find the campground with provided ID
    console.log('show route ',req.params.id)
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(3000, function(){
    console.log("The YelpCamp Server has started!");
});