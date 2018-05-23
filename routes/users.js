// NPM DEPDENCIES
//=========================
var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");

var User = require("../models/user");

// ROUTE LOGIC
//=======================================================
// GET Routes
//=======================================================

//GET the User REGISTER page
router.get("/register", function(req, res) {
	res.render("register", {
		title: "Register"
	});
});

//GET the User LOG IN page
router.get("/login", function(req, res) {

	if (res.locals.user) {
		res.redirect("/")	
	}
	else {
		res.render("login", {
			title: "Log In"
		});
	}
});


//GET the User LOG IN page
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "You are logged out!");
	res.redirect("/users/login");
});

//=======================================================
// POST Routes
//=======================================================
//Post the User REGISTER page
router.post("/register", function(req, res) {

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody("name", "Name is required!").notEmpty();
	req.checkBody("email", "Email is required!").notEmpty();
	req.checkBody("username", "Username is required!").notEmpty();
	req.checkBody("password", "Password is required!").notEmpty();
	req.checkBody("password2", "Password2 is required!").notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render("register", {
			errors: errors,
			user: null,
			title: "Register",
		});
	}
	else{
		User.findOne({username: username}, function(err, user){
			if (err) console.log(err);

			if (user) {
				req.flash("danger", "Username already exists.  Please choose another.");
				res.redirect("/users/register");
			}
			else {
				var user = new User({
					name: name,
					email: email,
					username: username,
					password: password,
					admin: 0
				});

				bcrypt.genSalt(10, function(err, salt){
					bcrypt.hash(user.password, salt, function(err, hash){
						if(err) console.log(err);
						user.password = hash;

						user.save(function(err){
							if(err) console.log(err);
							
							else {
								req.flash("success", "Welcome to the party! You are now registered.");
								res.redirect("/users/login");
							}
						});
					});
				});
			}
		});
	}
});

//Post the User LOG IN page
router.post("/login", function(req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/",
		faliureRedirect: "/users/login",
		faliureFlash: true
	})(req, res, next);
});

module.exports = router;