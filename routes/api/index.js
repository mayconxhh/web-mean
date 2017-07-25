var express   = require('express')
var mongoose  = require('mongoose')
var jwt       = require('jsonwebtoken')
var router    = express.Router()
var User      = require('../../models/user')

//Renew token
router.get('/renewToken/:username', function(req, res, next){
  User.findOne({ username: req.params.username }).select().exec(function(err, user){
    if (err) throw err
    if (!user) {
      res.json({ success: false, msg: 'No user was found' })
    } else {
      var newToken = jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '14d' })
      res.json({ success: true, msg: 'User authenticate', token: newToken })
    }
  })
})

// Checking permission
router.get('/permission', function(req, res, next){
  User.findOne({ username: req.decoded.username }, function(err, user){
    if (err) throw err
    if (!user) {
      res.json({ success: false, msg: 'No user was found' })
    } else {
      res.json({ success: true, permission: user.permission })
    }
  })
})

router.post('/me', function(req, res, next){
 res.send(req.decoded)
})

module.exports = router