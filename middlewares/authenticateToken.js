var jwt = require('jsonwebtoken')
var config = require('../config')
var secret = config.secret.token

function authenticateToken(req, res, next){
	var token = req.body.token || req.body.query || req.headers['x-access-token']

	if (token) {
		jwt.verify(token, secret, function(err, decoded){
			if (err) {
				res.json({success:false, msg:'Token invalid!'})
			} else{
				req.decoded = decoded
				next()
			}
		})
	} else {
		res.json({success: false, msg: 'No token provided'})
	}
}

module.exports = authenticateToken