var express = require('express')
var router = express.Router()
var User = require('../../models/user')

// Register new user - Method POST
// router.post('/new', function(req, res, next){
// 	console.log(req.body)
// 	if (req.body.username === null || req.body.username === '' || req.body.username === undefined || req.body.password === null || req.body.password === '' || req.body.password === undefined || req.body.email === null || req.body.email === '' || req.body.email === undefined) {
// 		res.json({success:false, msg: 'Ensure email, password and email were provided'})
// 	} else {
// 		var data = {
// 			username: req.body.username,
// 			password: req.body.password,
// 			email	: req.body.email,
// 			password_confirmation: req.body.confirm_password
// 		}

// 		console.log(password_confirmation)

// 		var user = new User(data)
// 		user.save(function(err, user){
// 			if (err) {
// 				if (err.errors) {
// 					var err = err.errors 
// 					if (err.name) {
// 						res.json({ success: false, msg:err.name })
// 					} else if(err.email){
// 						res.json({ success: false, msg:err.email })
// 					} else if(err.username){
// 						res.json({ success: false, msg:err.username })
// 					} else if(err.password){
// 						res.json({ success: false, msg:err.password })
// 					} else {
// 						res.json({ success: false, msg:err })
// 					}
// 				} else {
// 					if (err.code === 11000 ) {
// 						if (err.errmsg[61] === 'u') {
// 							res.json({success: false, msg:'that username is already exists!' })							
// 						} else if(err.errmsg === 'e'){
// 							res.json({ success: false, msg:'that email is already exists!' })
// 						} else {
// 							res.json({ success: false, msg: err.errmsg})
// 						}		
// 					}					
// 				}
// 			} else {
// 				var message = 'New registered user successfully'
// 				console.log(message)
// 				res.json({success: true, msg: message, user:user})			
// 			}
// 		})
// 	}
// })

router.post('/me', function(req, res, next){
	res.send(req.decoded)
})

module.exports = router