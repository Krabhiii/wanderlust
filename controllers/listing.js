const Listing = require("../models/listing");
const User = require("../models/user");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
module.exports.createListing = async (req, res, next) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(url,"..",filename);
         const imagePath = req.file ? req.file.path : "";
         const newListing = new Listing({
     ...req.body.listing,
     image:{url,filename}
 }); 
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
       await newListing.save();
        
        req.flash("success", "New listing created");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

module.exports.getAllListings = async (req, res, next) => {
    try {
        const alllisting = await Listing.find().populate("owner");
        res.render("listing/test", { alllisting });
    } catch (err) {
        next(err);
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new");
};

module.exports.getListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundlisting = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author" }
            })
            .populate("owner");
        if (!foundlisting) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        res.render("listing/show", { listing: foundlisting });
    } catch (err) {
        next(err);
    }
};

module.exports.renderEditForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundlisting = await Listing.findById(id);
        res.render("listing/edit", { foundlisting });
    } catch (err) {
        next(err);
    }
};

module.exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        // Update other fields
        listing.title = req.body.listing.title;
        listing.description = req.body.listing.description;
        listing.price = req.body.listing.price;
        listing.location = req.body.listing.location;
        listing.country = req.body.listing.country;

        // If a new image is uploaded, update it
        if (req.file) {
            listing.image = req.file.path ? { url: req.file.path, filename: req.file.filename } : req.file.filename;
        }
        // If no new image, keep the old one

        await listing.save();
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        next(err);
    }
};

module.exports.deleteListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        let deletedlisting = await Listing.findByIdAndDelete(id);
        req.flash("success", "listing deleted");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};