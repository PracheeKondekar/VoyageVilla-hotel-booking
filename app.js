if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const ExpressError = require("./utils/ExpressErrors");

// ================= DB =================
//const MONGO_URL = "mongodb://127.0.0.1:27017/VoyageVilla";
const MONGO_URL = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(MONGO_URL);
  
}
main()
  .then(() => console.log("✅ connected to db"))
  .catch(err => console.log(err));

// ================= VIEW ENGINE =================
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================

// body parser
app.use(express.urlencoded({ extended: true }));

// method override (IMPORTANT: before routes)
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// static files
app.use(express.static(path.join(__dirname, "public")));
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET_KEY,
  },
  touchAfter: 24 * 60 * 60, // time period in seconds
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});
// ================= SESSION =================
const sessionOptions = {
  store: store,
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false, // 🔥 changed to false (IMPORTANT)
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL LOCALS =================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ================= ROUTES =================
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("hii, i am root");
});

// ================= ERROR HANDLER =================

// 404
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// 🔥 REAL ERROR HANDLER (IMPORTANT)
app.use((err, req, res, next) => {
  console.log("🔥 ERROR:", err); // <-- THIS WILL SHOW YOUR REAL PROBLEM

  let { statusCode = 500, message = "Something went wrong" } = err;

  res.status(statusCode).send(message); // show error directly
});

// ================= SERVER =================
app.listen(3000, () => {
   console.log("🚀 server is listening on port 3000");
});
