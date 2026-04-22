const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const {listingSchema, reviewSchema} = require("../schema");
const ExpressError = require("../utils/ExpressErrors");
const wrapAsync = require("../utils/wrapAsync");

 
    const validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

   if(error) {
    let errMsg= error.details.map(el=>el.message).join(",");//joining all error messages into one string
     throw new ExpressError(400,errMsg);
   }
    else{
    next();
   }}



//review post route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    const {id}= req.params;
    const listing= await Listing.findById(id);
    const newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review added successfully");
    res.redirect(`/listings/${id}`);
}));
//review delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    const {id, reviewId}= req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    console.log("review deleted successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;