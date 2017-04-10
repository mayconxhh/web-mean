var jwt 				= require('jsonwebtoken')
var FacebookStrategy	= require('passport-facebook').Strategy
var TwitterStrategy		= require('passport-twitter').Strategy
var GoogleStrategy 		= require('passport-google-oauth').OAuth2Strategy;
var session				= require('express-session')
var moment				= require('moment')
var config				= require('../config')	
var User 				= require('../models/user')
var secret 				= config.secret.token

module.exports = function(app, passport){

	app.use(passport.initialize())
	app.use(passport.session())
	app.use(session({ secret: secret, resave: false, saveUninitialized: true, cookie: {secure: false, maxAge: 14 * 24 * 60 * 60 * 1000} }));

	passport.serializeUser(function(user, done) {
		if (user.active) {
			token = jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: moment().add(14, "days").unix() })
		} else {
			token = 'inactive/error'
		}
		done(null, user.id)
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user)
		});
	});

	passport.use(new FacebookStrategy({
		clientID: config.facebook.id,
		clientSecret: config.facebook.secret,
		callbackURL: "/auth/facebook/callback",
		profileFields: ['id', 'displayName', 'photos', 'email']
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({ email: profile._json.email}).select('username password email active').exec(function(err, user){
				if (err) done(err)

				if (user && user !== null) {
					done(null, user)
				} else {
					done(err)
				}
			})
		}
	))

	passport.use(new TwitterStrategy({
		consumerKey		: config.twitter.key,
		consumerSecret	: config.twitter.secret,
		callbackURL		: '/auth/twitter/callback',
		userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
	}, function(token, tokenSecret, profile, done){
		User.findOne({ email: profile._json.email}).select('username password email active').exec(function(err, user){
			if (err) done(err)

			if (user && user !== null) {
				done(null, user)
			} else {
				done(err)
			}
		})
	}))

	passport.use(new GoogleStrategy({
			clientID: config.google.id,
			clientSecret: config.google.secret,
			callbackURL: '/auth/google/callback'
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({ email: profile._json.emails[0].value}).select('username password email').exec(function(err, user){
				if (err) done(err)

				if (user && user !== null) {
					done(null, user)
				} else {
					done(err)
				}
			})
		}
	));

	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))

	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/socialerror' }), function(req, res){
		if(!req.user.active){
			res.redirect('/inactive/error')
		} else {
			res.redirect('/social/'+token)
		}
	})

	app.get('/auth/twitter', passport.authenticate('twitter', { scope: 'email' }))

	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/socialerror' }), function(req, res){
		if(!req.user.active){
			res.redirect('/inactive/error')
		} else {
			res.redirect('/social/'+token)
		}
	})

	app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/socialerror' }), function(req, res) {	
		if(!req.user.active){
			res.redirect('/inactive/error')
		} else {
			res.redirect('/social/'+token)
		}
	});

	return passport
}