// NPM DEPDENCIES
//=========================
var express = require("express");
var router = express.Router();

// Get DB Page Model:
var Page = require("../models/page");

// ROUTE LOGIC
//=========================
router.get("/", function(req, res) {
	res.redirect("/pages");
})

//GET the pages dashborad page...
router.get("/pages", function(req, res) {
	Page.findOne({slug: "home"}, function(err, page) {
		if(err) {
			console.log(err);
		}
		res.render("homeIndex", {
			title: "CMS Construction.Co",
			content: page.content
		});
	});
});


//GET a particlar/chosen page (by integrating the slug into the url)
router.get("/pages/:slug", function(req, res) {
	var slug = req.params.slug;

	Page.findOne({slug: slug}, function(err, page) {
		if(err) {
			console.log(err);
		}

		if (!page) {
			res.redirect("/page");
		}
		else {
			res.render("index", {
				title: page.title,
				content: page.content
			});
		}
	});
});

router.get("/pages/test", function(req, res) {
	res.send("This is the testing area...");
});

module.exports = router;