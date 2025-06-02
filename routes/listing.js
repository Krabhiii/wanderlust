const multer = require("multer");
const{storage} = require("../cloudconfig.js");
const upload = multer({storage}); 
const express = require("express");
const router = express.Router();
const { isLoggedIn ,isOwner} = require("../middleware.js");
const { listingSchema } = require("../schema.js");
const expresserror = require("../util/expresserror.js");
const listingController = require("../controllers/listing.js");
// Validation Middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new expresserror(400, errmsg);
    } else {
        next();
    }
};
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.route("/")
.post(upload.single("listing[image]"),validateListing, isLoggedIn, listingController.createListing)
// View All Listings Route
.get( listingController.getAllListings);
router.route("/:id")
.get(listingController.getListing)
.put( upload.single("listing[image]"), isLoggedIn, isOwner, listingController.updateListing)
// Delete Listing Route
.delete(isLoggedIn, listingController.deleteListing);
  
// Edit Listing Form Route
router.get("/:id/edit", isLoggedIn, listingController.renderEditForm);

module.exports = router;