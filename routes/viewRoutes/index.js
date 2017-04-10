var express = require('express')
var router = express.Router()

// This to access the html files
router.get('/partials/:name', function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
});

module.exports = router