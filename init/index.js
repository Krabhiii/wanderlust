const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../model/listing.js");
const User = require("../models/user.js"); 
Main().then(()=>{
    console.log("connection is successful");
}).catch((err)=>{
    console.log(err)
});
async function Main() {
    await(mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"));
};
const initDB = async()=>{
    await listing.deleteMany({});
await listing.insertMany(dataWithOwner);
console.log("data was initialized")

}
initDB();