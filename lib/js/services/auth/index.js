export default ['$http', 'AuthToken', function($http, AuthToken){
	var authFactory = {}
	// Login user
	// Auth.login(dataUser)
	authFactory.login = function(user){
		return $http({
			method: 'POST',
			url: '/login',
			data: user
		}).then(function(res){
			AuthToken.setToken(res.data.token)
			return res
		})
	}
	// Auth.isLoggedIn()
	authFactory.isLoggedIn = function(){
		if (AuthToken.getToken()) {
			return  true
		} else {
			return false
		}
	}
	// Auth.social(token)
	authFactory.social = function(token){
		AuthToken.setToken(token)
	}

	// Auth.getUser()
	authFactory.getUser = function(){
		if (AuthToken.getToken) {
			return $http({
				method: 'POST',
				url: '/api/user/me'
			})
		} else {
			$q.reject({msg: 'user has no token'})
		}
	}

	// Auth.logout()
	authFactory.logout = function(){
		AuthToken.setToken()
	}

	return authFactory
}]