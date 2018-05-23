// NPM DEPDENCIES
//=========================
var express = require("express");
var router = express.Router();

var Product = require("../models/product");

// ROUTE LOGIC
//=========================
//GET the page that ADDS PRODUCTS to the cart form ; ie" "cart/add/:product;"
router.get("/add/:product", function(req, res) {
	var slug = req.params.product;

	Product.findOne({slug: slug}, function(err, product) {
		if(err) {
			console.log(err);
		}

		if (typeof req.session.cart === "undefined") {
			req.session.cart = [];

			req.session.cart.push ({
				title: slug,
				qty: 1,
				price: parseFloat(product.price).toFixed(2),
				image: "/product_images/" + product._id + "/" + product.image
			});
		}
		else {
			var newItem;
			var cart = req.session.cart;			
			// console.log("cart.length was : ");
			// console.log(cart.length);
			
			for (var i = 0; i < cart.length; i++) {
				if (cart[i].title === slug) {
					cart[i].qty++;
					newItem = false;
					break;
				}
				else {
					newItem = true;
				}
			}

			if (newItem) {
				cart.push({
					title: slug,
					qty: 1,
					price: parseFloat(product.price).toFixed(2),
					image: "/product_images/" + product._id + "/" + product.image
				});
			}
		}

		console.log(req.session.cart);
		console.log("cart.length is : ");
		console.log(req.session.cart.length);

		req.flash("success", "Product added!");
		res.redirect("back");

	});
});

//GET the page for the CART Checkout; ie" "cart/checkout"
router.get("/checkout", function(req, res) {
	if (req.session.cart && req.session.cart.length === 0) {
		delete req.session.cart;
		res.redirect("/cart/checkout");
	}
	else {		
		res.render("checkout", {
			title: "Checkout",
			cart: req.session.cart
		});
	}
});

//GET the page for the PRODUCT UPDATE; ie" "cart/updated/:product"
router.get("/update/:product", function(req, res) {
	var slug = req.params.product;
	var cart = req.session.cart;
	var action = req.query.action;

	for (var i = 0; i < cart.length; i++) {
		if(cart[i].title === slug) {
			switch (action) {
				case "add" :
					cart[i].qty++;
					break;
				case "remove" :
					cart[i].qty--;
					if (cart[i].qty < 1) {
						cart.splice(i,1);
					}
					break;
				case "clear" :
					cart.splice(i,1);
					if (cart.length === 0) {
						delete req.session.cart;
					}
					break;
				default:
					console.log("There is a cart updating ERROR. (check out cart.js)...")
					break;
			}
			break;
		}
	}

	console.log(req.session.cart);
	req.flash("success", "Cart updated!");
	res.redirect("/cart/checkout");
});

//GET the CLEAR CART page; ie" "cart/clear;"
router.get("/clear", function(req, res) {
	delete req.session.cart;
	console.log(req.session.cart);
	req.flash("success", "Cart cleared!");
	res.redirect("/cart/checkout");
});


//GET the Buy-Now CART page; ie" "cart/buynow;"
router.get("/buynow", function(req, res) {
	console.log("req.session.cart  = ");
	console.log(req.session.cart);

	delete req.session.cart;

	console.log("req.session.cart was deleted... ");
	console.log("NOW, req.session.cart  = ");
	console.log(req.session.cart);
	res.sendStatus(200);
});


module.exports = router;