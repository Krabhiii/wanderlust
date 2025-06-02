const express = require("express");
const router  = express.Router({mergeParams:true});
const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const expresserror = require("../util/expresserror.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


const validateReview = (req,res,next) =>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new expresserror(400,errmsg);
    }else{
        next();
    }
};
// Create Review Route
router.post("/",validateReview,isLoggedIn,reviewController.createReview);
    // Delete Review Route
router.delete("/:reviewId",isReviewAuthor, reviewController.deleteReview);

module.exports = router;