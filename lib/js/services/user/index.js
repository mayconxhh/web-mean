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

	return userFactory
}]