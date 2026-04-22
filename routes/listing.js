const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const {listingSchema, reviewSchema} = require("../schema");
const ExpressError = require("../utils/ExpressErrors");
const wrapAsync = require("../utils/wrapAsync");

const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);

   if(error) {
    let errMsg= error.details.map(el=>el.message).join(",");//joining all error messages into one string
     throw new ExpressError(400,errMsg);
   }
   else{
    next();
   }
 }
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    console.log(`Rendering ${allListings.length} listings`);
    res.render("listings/index.ejs", { allListings });
}));
 console.log("Listing routes loaded");
 //Index Route
//  router.get("/", async (req, res) => {
//     res.send("Listings route working");
// });

//  router.get("/",wrapAsync(async(req,res)=>{
//     const allListings= await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
//      }));

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});


// Update Route
router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
    if(!req.body.listing) {   // ✅ FIXED
        throw new ExpressError(400,"Send valid data for listing");
    } 
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));

 // Edit Route  ✅ ADD THIS
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/edit.ejs", { listing });
})); 
    //show route
 router.get("/:id",wrapAsync(async(req,res)=>{
    const {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");//populating reviews in listing
     res.render("listings/show.ejs",{listing});//passing data to ejs file
})); 

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    id=id.trim();
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

module.exports = router;