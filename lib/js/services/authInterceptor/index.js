export default ['AuthToken', function(AuthToken){
	var authInterceptorFactory = {}
	authInterceptorFactory.request = function(config){
		var token = AuthToken.getToken()
		if (token) {
			config.headers['x-access-token'] = token
		}
		return config
	}
	return authInterceptorFactory
}]