

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressErrors");

const { listingSchema, reviewSchema } = require("./schema");
const path = require("path");

const listings = require("./routes/listing.js");
const review = require("./routes/review.js");

// Middleware
app.use(express.urlencoded({ extended: true }));



// Routes
app.use("/listings", listings);
app.use("/listings/:id/review", review);

// DB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/VoyageVilla";

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("connected to db"))
  .catch(err => console.log(err));

// EJS setup
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));


// Root route
app.get("/", (req, res) => {
  res.send("hii, i am root");
});

// Error handling
app.use((req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.render("listings/error.ejs");
});

// Server
app.listen(3000, () => {
  console.log("server is listening to port 3000");
});