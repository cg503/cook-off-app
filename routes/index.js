var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
	res.render('helloworld', {title: 'Hello, World!' })
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('userlist', {
			"userlist" : docs
		});
	});
});

/* GET New User page. */
router.get('/newuser', function(req,res) {
	res.render('newuser', { title: 'Add New User' });
});

/* GET Meatballs page. */
router.get('/meatballs/:meatball_ID', function(req,res) {
	var meatball_ID = req.params.meatball_ID;
	var food = "meatballs";
	res.render('meatballs', { title: 'Vote for Meatball ' + meatball_ID , ID: meatball_ID , food: food });
});

/*GET Complete page. */
router.get('/complete', function(req,res) {
	res.render('complete', {title: 'Thank you for voting!' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {
	// Set our internal DB variable
	var db = req.db;
	
	// Get our form values. These rely on the "name" attributes
	var userName = req.body.username;
	var userEmail = req.body.useremail;
	
	// Set our collection
	var collection = db.get('usercollection');
	
	// Submit to the DB
	collection.insert({
		"username" : userName,
		"email" : userEmail
	}, function (err, doc) {
		if (err) {
			// If it failed, return error
			res.send("There was a problem adding the information to the database.")
		}
		else {
			// If it worked, set the header so the address bar doesn't still say /adduser
			res.location("userlist");
			// And forward to success page
			res.redirect("userlist");
		}
	});
});

/* POST to Meatball Service */
router.post('/meatballs', function(req, res) {
	console.log("here");
	// Set our internal DB variable
	var db = req.db;
	
	// Get our form values. These rely on the "name" attributes
	var meatball_ID = req.body.meatball_ID;
	var sauce = req.body.sauce;
	var originality = req.body.originality;
	var food = req.body.food;
	
	// Set our collection
	var collection = db.get('cookoffdata');
	
	// Submit to the DB
	collection.insert({
		"meatball_ID" : meatball_ID,
		"sauce" : sauce,
		"originality" : originality,
		"food" : food
		
	}, function (err, doc) {
		if (err) {
			// If it failed, return error
			res.send("There was a problem adding the information to the database.")
		}
		else {
			// If it worked, set the header so the address bar doesn't still say /adduser
			res.location("complete");
			// And forward to success page
			res.redirect("complete");
		}
	});
});

module.exports = router;