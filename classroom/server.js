const express = require("express");
const app= express();
const users = require("./routes/user");
const posts = require("./routes/post");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));
app.get("/getsignedcookies" , (req,res) =>{
    res.cookie("made in","India",{signed:true});
    res.send("sent you a signed cookie");
})
app.get("/verifycookies" , (req,res) =>{
    console.log(req.signedCookies);
     res.send("verified signed cookies");
})

app.get("/getcookies" , (req,res) =>{
    res.cookie("greeting","hello");
    res.send("sent you a cookie");
})

app.get("/" , (req,res) =>{
    console.dir(req.cookies);
     res.send("hi,I am root!");
})

app.use("/users" , users);
app.use("/posts" , posts);


app.listen(3000,()=>{
    console.log("server is running on port 3000");
})