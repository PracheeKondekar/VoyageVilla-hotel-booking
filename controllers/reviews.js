const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema");
const ExpressError = require("../utils/ExpressErrors");
const wrapAsync = require("../utils/wrapAsync");

module.exports.createReview = async(req,res)=>{
    const {id}= req.params;
    const listing= await Listing.findById(id);
    const newReview= new Review(req.body.review);
    newReview.author= req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(newReview);
    console.log("review added successfully");
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId}= req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
   await Review.findByIdAndDelete(reviewId);
    console.log("review deleted successfully");
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}
