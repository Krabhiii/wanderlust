const { ref } = require("joi");
const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Review = require("./review.js");
const user = require("./user.js");
const User = require("../models/user.js"); // <-- Add this line
const Schema = mongoose.Schema;
const listingschema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename:String,

    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    
});
listingschema.post("findOneAndDelete",async(listing)=>{
await Review.deleteMany({reviews:{$in:listing.reviews}});
})
const listing = mongoose.model("listing", listingschema);
module.exports = listing;