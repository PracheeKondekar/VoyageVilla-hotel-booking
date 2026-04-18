const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");
const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    url: {
      type: String,
      required: true,
      default: "https://via.placeholder.com/800x600?text=No+Image+Available"
    }
  },

  price: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});



module.exports = mongoose.model("Listing", ListingSchema);
//module.exports= mongoose.model("Listing",ListingSchema);