
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { listingSchema, reviewSchema } = require("../schema");
const ExpressError = require("../utils/ExpressErrors.js");
const wrapAsync = require("../utils/wrapAsync.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({path:"reviews",
        populate:{path:"author",}}
       ,
      )
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  }

  module.exports.createListing = async (req, res) => {
      const newListing = new Listing(req.body.listing);
  
      // 🔥 Assign owner (VERY IMPORTANT)
      newListing.owner = req.user._id;
      newListing.image = { 
        url: req.file.path,
        filename: req.file.filename
       }
  console.log(req.user);
      await newListing.save();
      req.flash("success", "Listing created successfully!");
      res.redirect(`/listings/${newListing._id}`); 
     }

     module.exports.renderEditForm = async (req, res) => {
         const { id } = req.params;
     
         const listing = await Listing.findById(id);
     
         if (!listing) {
           req.flash("error", "Listing does not exist!");
           return res.redirect("/listings"); // ✅ FIXED
         }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
         res.render("listings/edit.ejs", { listing ,originalImageUrl});
       }

       module.exports.updateListing = async (req, res) => {
           let { id } = req.params;
       
           let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});
           if (typeof req.file !== "undefined") {
           let url = req.file.path;
           let filename = req.file.filename;
           listing.image = { url, filename };
            await listing.save();
            }
           req.flash("success", "Listing updated successfully!");
           res.redirect(`/listings/${id}`); // ✅ Correct redirect
         }

         module.exports.deleteListing = async (req, res) => {
             let { id } = req.params;
         
             await Listing.findByIdAndDelete(id);
         
             req.flash("success", "Listing deleted successfully!");
             res.redirect("/listings");
           }