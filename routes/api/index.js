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

// Get all users
router.get('/management', function(req, res, next){
  User.find({}, function(err, users){
    if(err) throw err

    User.findOne({username: req.decoded.username }, function(err, mainUser){
      if(err) throw err
      if (!mainUser) {
        res.json({ success: false, msg: 'No user found' })
      } else {
        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
          if (!users) {
            res.json({ success: false, msg: 'Users no found' })
          } else {
            res.json({ success: true, users: users, permission: mainUser.permission })
          }
        } else {
          res.json({ success: false, msg: 'Insufficient Permissions' })
        }
      }
    })
  })
})

// Delete user
router.delete('/management/:username', function(req, res, next){
  var deleteUser = req.params.username
  User.findOne({ username: req.decoded.username }, function(err, mainUser){
    if(err) throw err
    if (!mainUser) {
      res.json({ success: false, msg: 'No user found' })
    } else {
      if (mainUser.permission !== 'admin') {
        res.json({ success: false, msg: 'Insufficient Permissions' })
      } else {
        User.findOneAndRemove({ username: deleteUser }, function(err, user){
          if(err) throw err
          if (!user) {
            res.json({ success: true, msg: 'User deleted' })
          }
        })
      }
    }
  })
})

// Get User
router.get('/management/edit/:id', function(req, res, next){
  var editUser = req.params.id
  User.findOne({ username: req.decoded.username }, function(err, mainUser){
    if(err) throw err
    if (!mainUser) {
      res.json({ success: false, msg: 'No user found' })
    } else {
      if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
        User.findOne({ _id: editUser }, function(err, user){
          if(err) throw err
          if (!user) {
            res.json({ success: false, msg: 'User no found' })
          } else {
            res.json({ success: true, user: user })
          }
        })
      } else {
        res.json({ success: false, msg: 'Insufficient Permissions' })
      }
    }
  })
})

// Edit User
router.put('/management/edit', function(req, res, next){
  var editUser = req.body.currentUser
  if(req.body.name) var newName = req.body.name
  if(req.body.username) var newUsername = req.body.username
  if(req.body.email) var newEmail = req.body.email
  if(req.body.permission) var newPermission = req.body.permission

  User.findOne({ username: req.decoded.username}, function(err, mainUser){
    if(err) throw err
    if(!mainUser){
      res.json({ sucess: false, msg: 'User no found'})
    } else {
      // Edit Name
      if (newName) {
        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
          User.findOne({ _id: editUser }, function(err, user){
            if(err) throw err
            if (!user) {
              res.json({ success: false, msg: 'User no found' })
            } else {
              user.name = newName
              user.save(function(err){
                if(err) {
                  console.log(err)
                } else {
                  res.json({ success: true, msg: 'Name has been update'})
                }
              })
            }
          })
        } else {
          res.json({ succces: false, msg: 'Insufficient Permissions'})
        }
      }
      // Edit Username
      if (newUsername) {
        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
          User.findOne({ _id: editUser }, function(err, user){
            if(err) throw err
            if (!user) {
              res.json({ success: false, msg: 'User no found' })
            } else {
              user.username = newUsername
              user.save(function(err){
                if(err) {
                  console.log(err)
                } else {
                  res.json({ success: true, msg: 'Username has been update'})
                }
              })
            }
          })
        } else {
          res.json({ succces: false, msg: 'Insufficient Permissions'})
        }
      }
      // Edit Email
      if (newEmail) {
        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
          User.findOne({ _id: editUser }, function(err, user){
            if(err) throw err
            if (!user) {
              res.json({ success: false, msg: 'User no found' })
            } else {
              user.email = newEmail
              user.save(function(err){
                if(err) {
                  console.log(err)
                } else {
                  res.json({ success: true, msg: 'E-mail has been update'})
                }
              })
            }
          })
        } else {
          res.json({ succces: false, msg: 'Insufficient Permissions'})
        }
      }
      // Edit permissions
      if (newPermission) {
        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
          User.findOne({ _id: editUser }, function(err, user){
            if(err) throw err
            if (!user) {
              res.json({ success: false, msg: 'User no found' })
            } else {
              if (newPermission === 'user') {
                if (user.permission === 'admin') {
                  if (mainUser.permission !== 'admin') {
                    res.json({ success: false, msg: "Insufficient Permissions. You must be an admin to downgrade another admin" })
                  } else {
                    user.permission = newPermission
                    user.save(function(err){
                      if(err) {
                        console.log(err)
                      } else {
                        res.json({ success: true, msg: 'Permission have been update'})
                      }
                    })
                  }
                } else {
                  user.permission = newPermission
                  user.save(function(err){
                    if(err) {
                      console.log(err)
                    } else {
                      res.json({ success: true, msg: 'Permission have been update'})
                    }
                  })
                }
              }
              if (newPermission === 'moderator') {
                if (user.permission === 'admin') {
                  if (mainUser.permission !== 'admin') {
                    res.json({ success: false, msg: "Insufficient Permissions. You must be an admin to downgrade another admin" })
                  } else {
                    user.permission = newPermission
                    user.save(function(err){
                      if(err) {
                        console.log(err)
                      } else {
                        res.json({ success: true, msg: 'Permission have been update'})
                      }
                    })
                  }
                } else {
                  user.permission = newPermission
                  user.save(function(err){
                    if(err) {
                      console.log(err)
                    } else {
                      res.json({ success: true, msg: 'Permission have been update'})
                    }
                  })
                }
              }
              if (newPermission === 'admin') {
                if (mainUser.permission === 'admin') {
                  user.permission = newPermission
                  user.save(function(err){
                    if(err) {
                      console.log(err)
                    } else {
                      res.json({ success: true, msg: 'Permission have been update'})
                    }
                  })
                } else {
                  res.json({ success: false, msg: "Insufficient Permissions. You must be an admin to upgrade to the admin level" })
                }
              }
            }
          })
        } else {
          res.json({ succces: false, msg: 'Insufficient Permissions'})
        }
      }
    }
  })
})

router.post('/me', function(req, res, next){
 res.send(req.decoded)
})

module.exports = router