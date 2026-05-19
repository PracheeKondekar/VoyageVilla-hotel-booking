

// const mongoose = require("mongoose");
// const initData = require("./data");
// const Listing = require("../models/listing");

// const MONGO_URL = "mongodb://127.0.0.1:27017/VoyageVilla";

// main()
//   .then(() => {
//     console.log("connected to db");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});

//   initData.data = initData.data.map((obj) => ({
//     ...obj,
//   owner: new mongoose.Types.ObjectId("64b8c9e5f1a4c2b9d8e7a1c")  }));

//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const User = require("../models/user");

const MONGO_URL = "mongodb://127.0.0.1:27017/VoyageVilla";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to db");
}

const initDB = async () => {
  await Listing.deleteMany({});

  const user = await User.findOne(); // get existing user

  if (!user) {
    console.log("❌ No user found. Please signup first.");
    return;
  }

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: user._id,
  }));

  await Listing.insertMany(initData.data);
  console.log("✅ data was initialized");
};

main().then(initDB);