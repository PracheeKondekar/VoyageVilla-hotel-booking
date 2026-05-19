// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.redirectUrl = req.originalUrl // Store the original URL they were trying to access
//         req.flash("error", "You must be logged in to do that!");
//         return res.redirect("/login");
//         console.log("isAuthenticated:", req.isAuthenticated());
// console.log("user:", req.user);
//     }
//     next();
// };
module.exports.isLoggedIn = (req, res, next) => {
    console.log("isAuthenticated:", req.isAuthenticated());
    console.log("user:", req.user);

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make it available in res.locals
        // delete req.session.redirectUrl; // Clear it from the session
    }
    next();
};







module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(","); //joining all error messages into one string
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(","); //joining all error messages into one string
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the Owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// 🔐 Validate Listing Middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

   module.exports.validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

   if(error) {
    let errMsg= error.details.map(el=>el.message).join(",");//joining all error messages into one string
     throw new ExpressError(400,errMsg);
   }
    else{
    next();
   }}

  module.exports.isReviewAuthor= async(req,res,next)=>{
    const {id, reviewId} = req.params;
    const review= await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
  }
  



const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressErrors");
