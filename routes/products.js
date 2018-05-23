// NPM DEPDENCIES
//=========================
var express = require("express");
var router = express.Router();
var fs = require("fs-extra");
var auth = require("../config/auth");
var isUser = auth.isUser;

// Get DB Models
var Product = require("../models/product");
var Category = require("../models/category");

// ROUTE LOGIC
//=========================
//GET the products dashborad product...

// router.get("/", isUser, function(req, res) { >>> WOULD USE this ALTERNATIVE routing to require only LOGGEDIN USERS to access this route/page
router.get("/", function(req, res) {
    Product.find(function (err, products) {
        if (err)
            console.log(err);

        res.render('all_products', {
            title: "All Services",
            products: products
        });
    });
});


//GET all avaialble product(s) in the selected category (by integrating the slug into the url)
router.get("/:category", function(req, res) {
	var categorySlug = req.params.category;
	console.log("categorySlug");
	console.log(categorySlug);

	Category.findOne({slug: categorySlug}, function(err, category) {
		var categoryTitle = category.title;
		console.log("categoryTitle");
		console.log(categoryTitle);

		Product.find({category: categorySlug}, function(err, products) {
			if(err) {
				console.log(err);
			}
			if (!products) {
				res.render("category_products"), {
					title: categoryTitle.replace(/\-+/g, " "),
					products: "There are no products currently available in this category."
				}
			}
			else {
				res.render("category_products", {
					title: categoryTitle.replace(/\-+/g, " "),
					products: products
				});
			}
		})
	});
});
	

//GET the details of the selected product
router.get("/:category/:product", function(req, res) {
	var galleryImages = null;
	var loggedIn = (req.isAuthenticated()) ? true : false;

	Product.findOne({slug: req.params.product}, function(err, product) {
		if (err) {
			console.log(err);
		}
		else {
			var galleryDirectory = "public/product_images/" + product._id + "/gallery";

			fs.readdir(galleryDirectory, function(err, files) {
				if (err) {
					console.log(err);
				}
				else {
					galleryImages = files;
					res.render("product", {
						title: product.title,
						product: product,
						galleryImages: galleryImages,
						loggedIn: loggedIn
					});	
				}
			});
		}
	});
});

router.get("/test", function(req, res) {
	res.send("This is the testing area...");
});

module.exports = router;