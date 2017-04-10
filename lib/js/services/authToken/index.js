export default ['$window', function($window){

	var authTokenFactory = {}
	// User authentication
	// AuthToken.setToken(token)
	authTokenFactory.setToken = function(token){
		if (token) {
			$window.localStorage.setItem('token', token)
		} else {
			$window.localStorage.removeItem('token')
		}
	}
	// AuthToken.getToken()
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token')
	}

	return authTokenFactory
}]