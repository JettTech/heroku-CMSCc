// NPM DEPDENCY IMPORTS:
//=========================
var express = require("express");
var router = express.Router();
var auth = require("../config/auth");
var isAdmin = auth.isAdmin;

//===========================================================================
// ACCESS TO DB AND its MODEL:
//============================================================================
//Access to the Category Model
var Category = require("../models/category");

//============================================================
// ==============  GET ROUTE LOGIC  ============= 
//============================================================

//1.) To Get Admin Category Index:
//----------------------------------------------------------
//This route is refering to the "/admin/category/" ..as this part is the root file listed in the app.js file.
router.get("/",  function(req, res) {
	// res.send("This is the Admin Category Area");
	Category.find({}, function(err, categories) {
		if(err) return console.log(err);
		res.render("admin/categories", {
			title: "Category Dashboard",
			categories: categories
		});
	});
});

//2.) To Get Admin Categories Test:
//------------------------
//This route is refering to the "/admin/categories/test" ..as this part is the root file listed in the app.js file.
router.get("/test", function(req, res) {
	res.send("This is the testing area...");
});

//3.) To Get Admin Categories >> Add Category:
//------------------------------------------------------------------
//This route is refering to the "/admin/categories/add-category" ..as this part is the root file listed in the app.js file.
router.get("/add-category",  function(req, res) {
	var title = "";

	res.render("admin/add_category", {
		title: title
	});
});

//4.) To Get Edit-Categories Page >> Edit a Catetory- for Admin Views:
//-----------------------------------------------------------------------------------
//This route is refering to the "/admin/categories/add-category" ..as this part is the root file listed in the app.js file.
router.get("/edit-category/:id",  function(req, res) {
	Category.findById(req.params.id, function(err, category) {
		if(err) {
			return console.log(err);
		}
		//populate the edit category "category objs" by using/referencing the slug that was passed over through the url params
		res.render("admin/edit-category", {
			title: category.title.replace(/\-+/g, " "),
			id: category. _id
		});
	});
});


//4.) To GET the new Category page with deleted item  >> Delete a Category:
//-----------------------------------------------------------------------------------
//This route is refering to the "/admin/categories/delete-category" ..as this part is the root file listed in the app.js file.
router.get("/delete-category/:id", function(req, res) {
	//FYI: WE NEVER REDIRECT from the current (default) "/admin/categories category, as we are only updating
	//the dateabase with the exisitance of a document or not (and thus how maany/what docs ot display
	//on the current category or not)...
	Category.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			return console.log(err);
		}

		Category.find(function(err, categories) {
			if(err) {
				console.log(err);
			}
			else {
				req.app.locals.categories = categories;
			}
		});

		req.flash("success", "The category was successfully deleted.");
		res.redirect("/admin/categories");
	});
});

//============================================================
// ==============  POST ROUTE LOGIC  ============= 
//============================================================

//1.) To POST newly created Admin Categories to DB:
//---------------------------------------------------------------------------------
//This route is refering to the "/admin/categories/add-category" ..as this part is the root file listed in the app.js file.
router.post("/add-category", function(req, res) {
	//validate with the express-validator dependency:
	req.checkBody("title", "Title must have a value.").notEmpty();

	//using body-parser depencdy to parse and determine the "body" variable here:
	var title = req.body.title.trim().replace(/\s+/g, "-").toLowerCase();
	var slug = title.trim().replace(/\s+/g, "-").toLowerCase();

	console.log("\n");
	console.log("this is your category title:");
	console.log(title);
	console.log("this is your category slug:");
	console.log(slug);
	console.log("\n");

	var errors = req.validationErrors();
	if (errors) {
		console.log("You have an error");
		console.log(errors);

		res.render("admin/add_category", {
			errors: errors,
			title: title
		});
	}
	else if (title === " " || title === "-") {
		req.flash ("danger", "Title must have a value.");
		res.render("admin/add_category", {
			title: title
		});
	}
	else {
		console.log("You have successfully submitted your values!");
		//Format: Category.findOne({"CollectionName":"File Var", ie.Slug})
		Category.findOne({title:title}, function (err, category) {
			if (category) {
				//"flash" refers to the express-messages:
				req.flash ("danger", "This Category Title already exists. Please choose another.");
				res.render("admin/add_category", {
					title: title
				});
			}
			else {
				var category = new Category({
					title: title,
					slug: slug
				});

				category.save(function(err) {
					if (err) {
						return console.log(err);
					}

					Category.find(function(err, categories) {
							if(err) {
								console.log(err);
							}
							else {
								req.app.locals.categories = categories;
							}
					});

					req.flash("success", "Category added!");
					res.redirect("/admin/categories");
				});
			}
		});
	}
});

//2.) To Save(POST) the REORDER CATEGORY (while on the admin/categories site) in the DB:
//-------------------------------------------------------------------------------
//This route is refering to the "/admin/categories/reorder-categories" ..as this part is the root file listed in the app.js file.
router.post("/reorder-categories", function(req, res) {
	var ids = req.body["id[]"];
	var count = 0;

	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		count++;
		//implement closure to ensure that all category reordering is completed (as node === asynchronous)
		(function(count) { //opening closure
			Category.findById(id, function(err, category) {
				category.sorting = count;
				category.save(function(err) {
					if(err) return console.log(err);
				});
			});
		})(count); //ending for closure
	}
});


//============================================================
// ==============  UPDATE(/PUT) ROUTE LOGIC  ============= 
//============================================================

//1.) To UPDATE/PUT the Edited Categories to DB:
//---------------------------------------------------------------------------------
//This route is refering to the "/admin/categories/edit-category/:slug" ..as this part is the root file listed in the app.js file.
router.post("/edit-category/:id", function(req, res) {
	//validate with the express-validator dependency:
	req.checkBody("title", "Title must have a value.").notEmpty();

	//using body-parser depencdy to parse and determine the "body" variable here:
	var id = req.params.id; //taking the value from the url >> (we did not pass the id through a hidden input value on the "admin/category" page)
	var title = req.body.title.trim().replace(/\s+/g, "-").toLowerCase();
	var slug = title.trim().replace(/\s+/g, "-").toLowerCase();

	console.log("\n");
	console.log("this is your NEW Category id:");
	console.log(id);
	console.log("this is your NEW CATEGORY title:");
	console.log(title);
	console.log("this is your NEW CATEGORY slug:");
	console.log(slug);
	console.log("\n");

	var errors = req.validationErrors();
	if (errors) {
		console.log("You have an error");
		console.log(errors);

		res.render("admin/edit-category", {
			errors: errors,
			id: id,
			title: title
		});
	}
	else {
		console.log("You have submitted your values!");
		//Format: Category.findOne({"CollectionName":"File Var", ie.Slug})
		Category.findOne({title: title, _id:{"$ne":id}}, function (err, category) {
			//if something returns, there is more than one slug with same name(/content)...
			if (category) {
				//"flash" refers to the express-messages:
				req.flash ("danger", "This Category Title already exists. Please choose another.");
				res.render("admin/edit-category", {
					id: id,
					title: title.replace(/\-+/g, " ")
				});
			}

			//if there is nothing returned, then the slug is still unique (the only one)...
			else {
				Category.findById(id, function(err, category) {
					if (err) {
						return console.log();
					}

					console.log("this is the value of category and category.title: ");
					console.log(category);
					console.log(category.title);

					category.title = title;
					category.slug = slug;

					//save the updates to MongoDB;
					category.save(function(err) {
						if (err) {
							return console.log(err);
						}

						Category.find(function(err, categories) {
							if(err) {
								console.log(err);
							}
							else {
								req.app.locals.categories = categories;
							}
						});

						req.flash("success", "The category was successfully edited.");
						res.redirect("/admin/categories/edit-category/" + id );
					});
				});
			};
		});
	};
});

module.exports = router;