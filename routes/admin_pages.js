// NPM DEPDENCY IMPORTS:
//=========================
var express = require("express");
var router = express.Router();
var auth = require("../config/auth");
var isAdmin = auth.isAdmin;

//===========================================================================
// ACCESS TO DB AND its MODEL:
//============================================================================
//Access to the Page Model
var Page = require("../models/page");

//============================================================
// ==============  GET ROUTE LOGIC  ============= 
//============================================================

//1.) To Get Admin Pages Index:
//------------------------
//This route is refering to the "/admin/pages/" ..as this part is the root file listed in the app.js file.
router.get("/", function(req, res) {
	// res.send("This is the Admin Page Area");
	Page.find({}).sort({sorting: 1}).exec(function(err, pages) {
		res.render("admin/pages", {
			title: "Page Dashboard",
			pages: pages
		});
	});
});

//2.) To Get Admin Pages Test:
//------------------------
//This route is refering to the "/admin/pages/test" ..as this part is the root file listed in the app.js file.
router.get("/test", function(req, res) {
	res.send("This is the testing area...");
});


//3.) To Get Admin Pages >> Add Page:
//--------------------------------
//This route is refering to the "/admin/pages/add-page" ..as this part is the root file listed in the app.js file.
router.get("/add-page", function(req, res) {
	var title = "";
	var slug = "";
	var content = "";

	res.render("admin/add_page", {
		title: title,
		slug: slug,
		content: content
	});
});

//4.) To Get Edit-Page Pages >> Edit a Page-for Admin Views:
//--------------------------------
//This route is refering to the "/admin/pages/add-page" ..as this part is the root file listed in the app.js file.
router.get("/edit-page/:id", function(req, res) {
	Page.findById(req.params.id, function(err, page) {
		if(err) {
			return console.log(err);
		}

		//populate the edit page "page objs" by using/referencing the slug that was passed over through the url params
		res.render("admin/edit-page", {
			title: page.title.replace(/\-+/g, " "),
			slug: page.slug,
			content: page.content,
			id:page. _id
		});
	});
});

//5.) To Get Delete-Page Pages >> Delete a Page:
//-------------------------------------------------
//This route is refering to the "/admin/pages/delete-page" ..as this part is the root file listed in the app.js file.
router.get("/delete-page/:id", function(req, res) {
	//FYI: WE NEVER REDIRECT from the current (default) "/admin/pages page, as we are only updating
	//the dateabase with the exisitance of a document or not (and thus how maany/what docs ot display
	//on the current page or not)...

	Page.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			return console.log(err);
		}

		Page.find({}).sort({sorting: 1}).exec(function(err, pages) {
			if (err) {
				console.log(err)
			}
			else {
				req.app.locals.pages = pages;
			}
		});

		req.flash("success", "The page was successfully deleted.");
		res.redirect("/admin/pages");

	});
});


//============================================================
// ==============  POST ROUTE LOGIC  ============= 
//============================================================

//1.) To POST newly created Admin Pages to DB:
//-----------------------------------------------
//This route is refering to the "/admin/pages/add-page" ..as this part is the root file listed in the app.js file.
router.post("/add-page", function(req, res) {
	//validate with the express-validator dependency:
	req.checkBody("title", "Title must have a value.").notEmpty();
	req.checkBody("content", "Content must have a value.").notEmpty();

	//using body-parser depencdy to parse and determine the "body" variable here:
	var title = req.body.title.trim().replace(/\s+/g, "-").toLowerCase();
	var content = req.body.content.trim();
	var slug = req.body.slug;
	
	if (slug !== "" &&  slug !== " " && slug !== null && slug !== undefined) {
		slug = slug.trim().replace(/\s+/g, "-").toLowerCase();
	}
	else if (slug === "" && title !== "" || slug === " " && title !== "") {
		slug = title.trim().replace(/\s+/g, "-").toLowerCase();
	};

	console.log("\n");
	console.log("this is your title:");
	console.log(title);
	console.log("this is your content:");
	console.log(content);
	console.log("this is your slug:");
	console.log(slug);
	console.log("\n");

	var errors = req.validationErrors();
	if (errors) {
		console.log("You have an error");
		console.log(errors);

		res.render("admin/add_page", {
			errors: errors,
			title: title,
			slug: slug,
			content: content
		});
	}
	else {
		console.log("You have successfully submitted your values!");
		//Format: Page.findOne({"CollectionName":"File Var", ie.Slug})
		Page.findOne({slug:slug}, function (err, page) {
			if (page) {
				//"flash" refers to the express-messages:
				req.flash ("danger", "This Page Slug already exists. Please choose another.");

				res.render("admin/add_page", {
					title: title,
					slug: slug,
					content: content
				});
			}
			else {
				var page = new Page({
					title: title,
					slug: slug,
					content: content,
					sorting: Infinity //this is Inifinity, so that whenever another item is added, it becomes the (largest one) last one within the list.
				});

				page.save(function(err) {
					if (err) {
						return console.log(err);
					}

					Page.find({}).sort({sorting: 1}).exec(function(err, pages) {
						if (err) {
							console.log(err)
						}
						else {
							req.app.locals.pages = pages;
						}
					});

					req.flash("success", "Page added!");
					res.redirect("/admin/pages");
				});
			}
		});
	}

});

//2.) To POST the Re-Ordered Page list (while on the admin/pageges site) in the DB:
//-------------------------------------------------------------------------------
//sort pages Function >> to control the order of the function calls and execution... we need the page reorder to occur first and then(SECONDLY) the page sorting/rendering onto the client site.
function sortPages(ids, callback) {
	var count = 0;

	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		count++;
		//implement closure to ensure that all page reordering is completed (as node === asynchronous)
		(function(count) { //opening closure
			Page.findById(id, function(err, page) {
				page.sorting = count;
				page.save(function(err) {
					if(err) return console.log(err);
					count++;
					if (count >= ids.length) {
						callback(); //in this scenario, all of the ids (all the pages therefore), have been processed/interated over...
					}
				});
			});
		})(count); //ending for closure
	}
};
//This route is refering to the "/admin/pages/reorder-pages" ..as this part is the root file listed in the app.js file.
router.post("/reorder-pages", function(req, res) {
	var ids = req.body["id[]"];

	sortPages(ids, function() {
		Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
			if(err) {
				console.log(err);
			}
			else {
				req.app.locals.pages = pages;
			}
		});
	});
});

//4.) To POST the UPDATE the Edited Pages to DB:
//-----------------------------------------------
//This route is refering to the "/admin/pages/edit-page/:slug" ..as this part is the root file listed in the app.js file.
router.post("/edit-page/:id", function(req, res) {
	//validate with the express-validator dependency:
	req.checkBody("title", "Title must have a value.").notEmpty();
	req.checkBody("content", "Content must have a value.").notEmpty();

	//using body-parser depencdy to parse and determine the "body" variable here:
	var id = req.body.id; //currnetly taking the value from the hidden input, but can also take if form the url by: "req.params.id";
	var title = req.body.title.trim().replace(/\s+/g, "-").toLowerCase();
	var content = req.body.content.trim();
	var slug = req.body.slug;
	
	if (slug !== "" &&  slug !== " " && slug !== null && slug !== undefined) {
		slug = slug.trim().replace(/\s+/g, "-").toLowerCase();
	}
	else if (slug === "" && title !== "" || slug === " " && title !== "") {
		slug = title.trim().replace(/\s+/g, "-").toLowerCase();
	};

	console.log("\n");
	console.log("this is your NEW title:");
	console.log(title);
	console.log("this is your NEW content:");
	console.log(content);
	console.log("this is your NEW slug:");
	console.log(slug);
	console.log("\n");

	var errors = req.validationErrors();
	if (errors) {
		console.log("You have an error");
		console.log(errors);

		res.render("admin/edit-page", {
			errors: errors,
			id: id,
			title: title,
			slug: slug,
			content: content
		});
	}
	else {
		console.log("You have submitted your values!");
		//Format: Page.findOne({"CollectionName":"File Var", ie.Slug})
		Page.findOne({slug:slug, _id:{"$ne":id}}, function (err, page) {
			//if something returns, there is more than one slug with same name(/content)...
			if (page) {
				//"flash" refers to the express-messages:
				req.flash ("danger", "This Page Slug already exists. Please choose another.");

				res.render("admin/edit-page", {
					id: id,
					title: title.replace(/\-+/g, " "),
					slug: slug,
					content: content
				});
			}
		})
		.then(Page.findOne({title: title, _id:{"$ne":id}}, function (err, page) {
			//if something returns, there is more than one slug with same name(/content)...
			if (page) {
				//"flash" refers to the express-messages:
				req.flash ("danger", "This Page Title already exists. Please choose another.");

				res.render("admin/edit-page", {
					id: id,
					title: title.replace(/\-+/g, " "),
					slug: slug,
					content: content
				});
			}

			//if there is nothing returned, then the slug is still unique (the only one)...
			else {
				Page.findById(id, function(err, page) {
					if (err) {
						return console.log();
					}

					console.log("this is the value of page and page.title: ");
					console.log(page);
					console.log(page.title);

					page.title = title;
					page.slug = slug;
					page.content = content;

					//save the updates to MongoDB;
					page.save(function(err) {
						if (err) {
							return console.log(err);
						}

						Page.find({}).sort({sorting: 1}).exec(function(err, pages) {
							if (err) {
								console.log(err)
							}
							else {
								req.app.locals.pages = pages;
							}
						});

						req.flash("success", "The page was successfully edited.");
						res.redirect("/admin/pages/edit-page/" + id );
					});
				});
			};
		}));
	};
});


module.exports = router;