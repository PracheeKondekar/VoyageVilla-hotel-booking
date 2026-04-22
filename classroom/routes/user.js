const express = require("express");
const router = express.Router();

//Index - users
router.get("/", (req,res) =>{
    res.send("GET for users");
})
//show-users
router.get("/:id", (req,res) =>{
    res.send("GET for show users");
})
//Post-users
router.post("/", (req,res) =>{
    res.send("POST for users");
})
//Delete-users
router.delete("/:id", (req,res) =>{
    res.send("DELETE for users");
})
module.exports = router;