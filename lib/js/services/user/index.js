export default ['$http', function($http){
  var userFactory = {}

  // Register new user
  // User.create(user)
  userFactory.create = function(user){
    return $http({
      method: 'POST',
      url: '/new',
      data: user
    })
  }

  // Verifying username availability
  // User.checkingUsername(user)
  userFactory.checkingUsername = function(user){
    return $http({
      method: 'POST',
      url: '/checkingUsername',
      data: user
    })
  }

  // Verifying email availability
  // User.checkingEmail(user)
  userFactory.checkingEmail = function(user){
    return $http({
      method: 'POST',
      url: '/checkingemail',
      data: user
    })
  }

  // Account activation
  // User.accountActivate(token)
  userFactory.accountActivate = function(token){
    return $http({
      method: 'PUT',
      url: '/activate/'+token
    })
  }

  // Account check credential
  // User.checkCredential(user)
  userFactory.checkCredential = function(user){
    return $http({
      method: 'POST',
      url: '/resend',
      data: user
    })
  }

  // Resend account link activation
  // User.resendLink(username)
  userFactory.resendLink = function(username){
    return $http({
      method: 'PUT',
      url: '/resend',
      data: username
    })
  }

  // Request username
  // User.sendUsername(userEmail)
  userFactory.sendUsername = function(userEmail){
    return $http({
      method: 'GET',
      url: '/resetusername/'+userEmail
    })
  }

  // Reset password
  // User.sendPassword(resetData)
  userFactory.sendPassword = function(resetData) {
    return $http({
      method: 'PUT',
      url: '/resetpassword',
      data: resetData
    })
  }

  // Reset user
  // User.resetUser(token)
  userFactory.resetUser = function(token){
    return $http({
      method: 'GET',
      url: '/resetpassword/'+token
    })
  }

  // Change password
  // User.savePassword(userData)
  userFactory.savePassword = function(userData){
    return $http({
      method: 'PUT',
      url: '/savenewpassword',
      data: userData
    })
  }

  // Renew tokenfor session
  // User.renewSession(username)
  userFactory.renewSession = function(username){
    return $http({
      method: 'GET',
      url: '/api/user/renewToken/'+username
    })
  }

  // Check permission user
  // User.checkPermission()
  userFactory.checkPermission = function(){
    return $http({
      method: 'GET',
      url: '/api/user/permission'
    })
  }

  // Get all users
  userFactory.getUsers = function(){
    return $http({
      method: 'GET',
      url: '/api/user/management'
    })
  }

  // Edit user
  userFactory.getUser = function(id){
    return $http({
      method: 'GET',
      url: '/api/user/management/edit/'+id
    })
  }

  userFactory.editUser = function(user){
    return $http({
      method: 'PUT',
      url: '/api/user/management/edit',
      data: user
    })
  }

  // Delete user
  userFactory.delete = function(username){
    return $http({
      method: 'DELETE',
      url: '/api/user/management/'+username
    })
  }

  return userFactory
}]
