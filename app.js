var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    //cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Myalbum     = require("./models/myalbum"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override"),
    port    = process.env.PORT || 8080;
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    myalbumRoutes = require("./routes/myalbum"),
    indexRoutes      = require("./routes/index")

//mongoose.connect("mongodb://localhost/myalbum");
mongoose.connect("mongodb://appUser:helloworld@ds213118.mlab.com:13118/myalbum",function(err){
    if(err){
        console.log(err);
    }
    console.log("Access cloud DB Success...");
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
//app.use(cookieParser('secret'));

seedDB()
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "sharetomemorize",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/myalbum", myalbumRoutes);
app.use("/myalbum/:id/comments", commentRoutes);

app.listen(port, process.env.IP, function(){
   console.log("The Myalbum app Server Has Started!");
});