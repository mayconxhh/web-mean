var express 	  = require('express')
var mongoose 	  = require('mongoose')
var router 		  = express.Router()
var jwt 		    = require('jsonwebtoken')
var moment		  = require('moment')
var nodemailer 	= require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var User 		    = require('../../models/user')
var config 		  = require('../../config')
var secret 		  = config.secret.token


var options = {
	auth: {
		api_user: config.sengrid.user,
		api_key: config.sengrid.key
	}
}

var client = nodemailer.createTransport(sgTransport(options))

// Getting domain
var domain = function(req) {
  return req.protocol + '://' +req.get('host')
}

// User login route
router.post('/login', function(req, res, next){
	User.findOne({username: req.body.username}).select('email username password active').exec(function(err, user){
		if (err) throw err

		if (!user) {
			res.json({success: false, msg: 'Could not authenticate'})
		} else if(user) {
			console.log(user)
			if (req.body.password) {
				var validPassword = user.comparePassword(req.body.password)
			} else {
				res.json({success:false, msg:'No password no provided'})
			}
			if (!validPassword) {
				res.json({success: false, msg:'Could not authenticate password'})
			} else if(!user.active) {
				res.json({success: false, msg:'Your account is not activate! Please check you e-mail form  activation link.', expired: true })
			} else {
				var dateExpire = moment().add(14, "days").unix()
				var token = jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: dateExpire })
				res.json({success: true, msg: 'User authenticate', token: token})
			}
		}
	})
})

// Checking username availability
router.post('/checkingusername', function(req, res, next){
	User.findOne({username: req.body.username}).select('username').exec(function(err, user){

		if (user) {
			res.json({success: false, msg: 'That username is already exists!' })
		} else {
			res.json({success: true,  msg: 'Valid username.'})
		}

	})
})

// Checking gmail availability
router.post('/checkingemail', function(req, res, next){
	User.findOne({email: req.body.email}).select('email').exec(function(err, user){

		if (user) {
			res.json({success: false, msg: 'That email is registered!' })
		} else {
			res.json({success: true,  msg: 'Valid email.'})
		}

	})
})

// Register new user - Method POST
router.post('/new', function(req, res, next){
  // var domainUrl = domain(req)
	if (req.body.name === null || req.body.name === '' || req.body.username === null || req.body.username === '' || req.body.username === undefined || req.body.password === null || req.body.password === '' || req.body.password === undefined || req.body.email === null || req.body.email === '' || req.body.email === undefined) {
		res.json({success:false, msg: 'Ensure email, password and email were provided'})
	} else {

		var dateExpire = moment().add(30, "seconds").unix()

		var data = {
			name			: req.body.name,
			username		: req.body.username,
			password 		: req.body.password,
			email			: req.body.email,
			temporarytoken	: jwt.sign({username: req.body.username, email: req.body.email}, secret, { expiresIn: dateExpire })
		}

		var user = new User(data)
		user.save(function(err, user){
			if (err) {
				if (err.errors) {
					var err = err.errors
					if (err.name) {
						console.log('---- name ------')
						res.json({ success: false, msg:err.name.message })
					} else if(err.email){
						console.log('---- email ------')
						res.json({ success: false, msg:err.email.message })
					} else if(err.username){
						console.log('---- username ------')
						res.json({ success: false, msg:err.username.message })
					} else if(err.password){
						console.log('---- password ------')
						res.json({ success: false, msg:err.password.message })
					} else {
						console.log('---- err ------')
						res.json({ success: false, msg:err })
					}
				} else {
					if (err.code === 11000 ) {
						if (err.errmsg[61] === 'u') {
							res.json({success: false, msg:'That username is already exists!' })
						} else if(err.errmsg[61] === 'k'){
							res.json({ success: false, msg:'That email is already exists!' })
						} else {
							res.json({ success: false, msg: err.errmsg})
						}
					}
				}
			} else {

				var email = {
					from: 'Localhost, Staffawesome@bar.com',
					to: user.email,
					subject: 'Account activation link Localhost',
					text: 'Muchas gracias por registarte en nuestra web ' + user.name + 'Para culminar el proceso de registro, por favor activa tu cuenta siguiendo este enlace: ' + domain(req) + '/activate/'+ user.temporarytoken,
					html: '<div><h2>Muchas gracias por registarte en nuestra web <strong>' + user.name + '</strong>.</h2><p>Para culminar el proceso de registro, por favor activa tu cuenta haciendo click <a href="'+ domain(req) + '/activate/' + user.temporarytoken +'">Aquí</a>.</p></div>'
				}

				client.sendMail(email, function(err, info){
					if (err ){
						console.log(err);
					}
					else {
						console.log('Message sent: ' + info.message);
					}
				})

				var message = 'Account registered! Please check your e-mail for activation link.'
				console.log(message)
				res.json({success: true, msg: message, user:user})
			}
		})
	}
})

// Activation account for token
router.put('/activate/:token', function(req, res, next){
	User.findOne({ temporarytoken: req.params.token }, function(err, user){
		if (err) throw err
		var token = req.params.token

		jwt.verify(token, secret, function(err, decoded){
			console.log(err)
			if (err) {
				res.json({success:false, msg:'Activation link has expire!'})
			} else if(!user){
				res.json({success:false, msg:'Activation link has expire!'})
			} else {
				user.temporarytoken = false
				user.active 		= true

				user.save(function(err){
					if (err) {
						console.log(err)
					} else {

						var email = {
							from: 'Localhost, Staffawesome@bar.com',
							to: user.email,
							subject: 'Account activated!',
							text: 'Muchas gracias por registarte en nuestra web ' + user.name + '.Tu cuenta fue activada con exito, puedes interactuar en nuestra plataforma :)',
							html: '<div><h2>Muchas gracias por registarte en nuestra web <strong>' + user.name + '</strong>.</h2><p>Tu cuenta fue activada con exito, puedes interactuar en nuestra plataforma :)</p></div>'
						}

						client.sendMail(email, function(err, info){
							if (err ){
								console.log(err);
							}
							else {
								console.log('Message sent: ' + info.message);
							}
						})

						res.json({success:true, msg:'Account activated!'})
					}
				})

			}
		})
	})
})

// Account check not activated
router.post('/resend', function(req, res, next){
	User.findOne({username: req.body.username}).select('username password active').exec(function(err, user){
		if (err) throw err

		if (!user) {
			res.json({success: false, msg: 'Could not authenticate'})
		} else if(user) {
			if (req.body.password) {
				var validPassword = user.comparePassword(req.body.password)
			} else {
				res.json({success:false, msg:'No password no provided'})
			}
			if (!validPassword) {
				res.json({success: false, msg:'Could not authenticate password'})
			} else if(user.active) {
				res.json({success: false, msg:'Account is already activated.'})
			} else {
				res.json({success: true})
			}
		}
	})
})

// resending email for account activation
router.put('/resend', function(req, res, next){
	User.findOne({username: req.body.username}).select('username name email temporarytoken').exec(function(err, user){
		if (err) throw err
		var dateExpire = moment().add(30, "seconds").unix()
		user.temporarytoken = jwt.sign({username: req.body.username, email: req.body.email}, secret, { expiresIn: dateExpire })

		user.save(function(err, user){
			if (err) {
				console.log(err)
			} else {
				var email = {
					from: 'Localhost, Staffawesome@bar.com',
					to: user.email,
					subject: 'Account activation link Localhost request',
					text: 'Hola ' + user.name + 'Haz solicitado recientemente un nuevo link de activación para tu cuenta, por favor activa tu cuenta siguiendo este enlace: ' + domain(req) + '/activate/'+ user.temporarytoken,
					html: '<div><h2>Hola <strong>' + user.name + '</strong>.</h2><p>Haz solicitado recientemente un nuevo link de activación para tu cuenta, por favor activa tu cuenta haciendo click <a href="' + domain(req) + '/activate/'+ user.temporarytoken +'">Aquí</a>.</p></div>'
				}

				client.sendMail(email, function(err, info){
					if (err ){
						console.log(err);
					}
					else {
						console.log('Message sent: ' + info.message);
					}
				})

				res.json({ success: true, msg: 'Activation link has been sent to '+user.email})
			}
		})
	})
})

// Request to recover username
router.get('/resetusername/:email', function(req, res, next){
	User.findOne({ email: req.params.email }).select('email name username').exec(function(err, user){
		if (err) {
			res.json({ success: false, msg: err})
		} else {
			if (!user) {
				res.json({ success: false, msg: 'E-mail was no found'})
			} else {

				var email = {
					from: 'Localhost, Staffawesome@bar.com',
					to: user.email,
					subject: 'Localhost username request!',
					text: 'Hola ' + user.name + '. Haz solicitado recientemente el nombre de usuario de tu cuenta, por favor guarda tus datos en un lugar seguro: ' + user.username,
					html: '<div><h2>Hola <strong>' + user.name + '</strong>.</h2><p>Haz solicitado recientemente el nombre de usuario de tu cuenta, por favor guarda tus datos en un lugar seguro: ' + user.username + '.</p></div>'
				}

				client.sendMail(email, function(err, info){
					if (err ){
						console.log(err);
					}
					else {
						console.log('Message sent: ' + info.message);
					}
				})

				res.json({ success: true, msg: 'Username has been  sent to e-mail' })
			}
		}
	})
})

// Request to change password
router.put('/resetpassword', function(req, res, next){
  User.findOne({ username: req.body.username }).select('username active name email resetToken').exec(function(err, user){
    if (err) throw error
    if (!user) {
      res.json({ success: false, msg: 'Username was no found.' })
    } else if (!user.active) {
      res.json({ success: false, msg: 'Account  has not yet activated' })
    } else {
      var dateExpire = moment().add(30, "seconds").unix()
  		user.resetToken = jwt.sign({username: req.body.username, email: req.body.email}, secret, { expiresIn: dateExpire })
      user.save(function(err){
        if (err) {
          res.json({ success: false, msg: err })
        } else {

          var email = {
  					from: 'Localhost, Staffawesome@bar.com',
  					to: user.email,
  					subject: 'Localhost reset password request!',
  					text: 'Hola ' + user.name + '. Haz solicitado recientemente cambiar la contraseña de tu cuenta, Pofavor entra al enlace para realizar dicho proceso: ' + domain(req) + '/reset/newpassword/' + user.resetToken,
  					html: '<div><h2>Hola <strong>' + user.name + '</strong>.</h2><p>Haz solicitado recientemente cambiar la contraseña de tu cuenta, Pofavor entra al enlace para realizar dicho proceso: <a href="' + domain(req) + '/reset/newpassword/' + user.resetToken + '">' + domain(req) + '/reset/newpassword/</a>.</p></div>'
  				}

  				client.sendMail(email, function(err, info){
  					if (err ){
  						console.log(err);
  					}
  					else {
  						console.log('Message sent: ' + info.message);
  					}
  				})

          res.json({ success: true, msg: 'Please check your e-mail for password reset link' })
        }
      })
    }
  })
})

// Checking token availability for change password
router.get('/resetpassword/:token', function(req, res, next){
  User.findOne({ resetToken: req.params.token }).select().exec(function(err, user){
    if (err) throw err
    var token = req.params.token

    jwt.verify(token, secret, function(err, decoded){
			if (err) {
				res.json({success:false, msg: err})
			} else{
				if (!user) {
				  res.json({ success: false, msg: 'Password link has expired' })
				} else {
          res.json({ success: true, user: user })
        }
			}
		})
  })
})

// Save new password
router.put('/savenewpassword', function(req, res, next){
  User.findOne({ username: req.body.username }).select('username email name password resetToken').exec(function(err, user){
    if (err) throw err
    if (req.body.password === null || req.body.password === '') {
      res.json({ success: false, msg: 'Password no provided' })
    } else {
      user.password = req.body.password
      user.resetToken = false
      user.save(function(err){
        if (err) {
          res.json({ success: false, msg: err })
        } else {

          var email = {
            from: 'Localhost, Staffawesome@bar.com',
            to: user.email,
            subject: 'Localhost reset password request!',
            text: 'Hola ' + user.name + '. Este e-mail es para notificarte que recientemente haz modificado la contraseña de tu cuenta en localhost.com.',
            html: '<div><h2>Hola <strong>' + user.name + '</strong>.</h2><p>Este e-mail es para notificarte que recientemente haz modificado la contraseña de tu cuenta en <a href="' + domain(req) + '">localhost.com</a>.</p></div>'
          }

          client.sendMail(email, function(err, info){
            if (err ){
              console.log(err);
            }
            else {
              console.log('Message sent: ' + info.message);
            }
          })

          res.json({ success: true, msg: 'Password has been reset' })
        }
      })
    }
  })
})

module.exports = router
