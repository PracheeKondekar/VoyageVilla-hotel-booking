const express = require("express");
const app= express();
const users = require("./routes/user");
const posts = require("./routes/post");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use("/users", users);
app.use("/posts", posts);
const session = require("express-session");

const sessionOptions ={
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
};
 
app.use(session(sessionOptions));

// app.get("/reqcount",( req, res )=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You have made ${req.session.count} requests`);
// });
app.use(( req, res, next )=>{
    res.locals.successsMsg = req.flash("success");
    res.locals.errMsg = req.flash("error");
    
    next();
});
app.get("/register",( req, res )=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user not registered");
    }else{
        req.flash("success", "user registered successfully");
    }
    res.redirect("/hello");
});
app.get("/hello",( req, res )=>{
    res.locals.successsMsg = req.flash("success");
    res.locals.errMsg = req.flash("error");
    res.render("page.ejs", {name: req.session.name});
});

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})