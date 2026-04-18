const express = require("express");
const app= express();
const mongoose= require("mongoose");
const Listing= require("./models/listing");
const Review = require("./models/reviews");
const wrapAsync= require("./utils/wrapAsync");
const ExpressError =require("./utils/ExpressErrors")
const { listingSchema, reviewSchema } = require("./schema");
const path= require("path");
app.use(express.urlencoded({extended:true}));
const MONGO_URL="mongodb://127.0.0.1:27017/VoyageVilla";//connsction to db
main()//calling main fun of db
.then(()=>{
console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
}
//ejs
const ejsMate= require("ejs-mate");
app.engine("ejs",ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

const methodOverride= require("method-override");//for put request
app.use(methodOverride("_method"));


 app.get("/",(req,res)=>{
    res.send("hii,i am root");
 });

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
    const validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

   if(error) {
    let errMsg= error.details.map(el=>el.message).join(",");//joining all error messages into one string
     throw new ExpressError(400,errMsg);
   }
    else{
    next();
   }}
 //Index Route
 app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
     }));

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings",validateListing,wrapAsync(async(req, res, next) => {
 
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");//redirecting to show route of newly created listing
   
}));


//update route
// Update Route
app.put("/listings/:id",validateListing, wrapAsync(async (req,res)=>{
    if(!req.body.listing) {   // ✅ FIXED
        throw new ExpressError(400,"Send valid data for listing");
    } 
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));
// app.put("/listings/:id",wrapAsync(async(req,res)=>{
//     if(!req.body.listing) {
//     throw new ExpressError(400,"Send valid data for listing");
//    } 
//     let{id}=req.params;
//     await Listing.findByIdAndUpdate(id,req.body.listing);
//     res.redirect(`/listings/${id}`);//redirecting to show route of updated listing
// }));
 // Edit Route  ✅ ADD THIS
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/edit.ejs", { listing });
}));   
//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    id=id.trim();
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
//review post route
app.post("/listings/:id/review",validateReview,wrapAsync(async(req,res)=>{
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
app.delete("/listings/:id/review/:reviewId",wrapAsync(async(req,res)=>{
    const {id, reviewId}= req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    console.log("review deleted successfully");
    res.redirect(`/listings/${id}`);
}));
 
    //show route
 app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");//populating reviews in listing
     res.render("listings/show.ejs",{listing});//passing data to ejs file
}));

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "My home villa",
    description: "beautiful place",
    price: 12000,
    location: "calangut",
    country: "India",
    image: {
      url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
    }
  });

  await sampleListing.save();
  res.send("successful testing");
});

app.use((req, res, next) =>{
   next(new ExpressError(404,"page not found"));
});
app.use((err, req, res, next)=>{
    let{statusCode =500, message="something went wrong"} =err;
   // res.status(statusCode).send(message);
    res.render("listings/error.ejs");
})
app.listen(3000,() => {
    console.log("server is listening to port 3000");
});