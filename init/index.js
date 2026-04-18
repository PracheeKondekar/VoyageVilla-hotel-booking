const mongoose= require("mongoose");
const initData= require("./data");
const Listing= require("../models/listing");
//mongodb connection 
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
const initDB =async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);//.data is key in data.js
    console.log("data was initialized");
}
initDB();
