

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressErrors");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn,isOwner,validateListing } = require("../middleware");
const { validateReview } = require("../middleware");
const listingController = require("../controllers/listings");
const multer  = require('multer');
const { storage }= require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index)
)
 .post(
 isLoggedIn,
 validateListing,
upload.single("listing[image]"),
wrapAsync(listingController.createListing)
 );
//.post(upload.single("listing[image][url]"),(req,res)=>{
  
 // res.send(req.file);



router.route("/new")
.get( listingController.renderNewForm
);
 router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
// router.route("/:id")
// .get(wrapAsync(listingController.showListing)
// )
// .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,
//   wrapAsync(listingController.updateListing)
// )
// .get(wrapAsync(listingController.showListing)
// )
// .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing)
// )
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);


module.exports = router;