export default ['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){

	// Access permits
	$rootScope.$on('$routeChangeStart', function(event, next, current){
		console.log(Auth.isLoggedIn())
		console.log(next.$$route.authenticated)

		if (next.$$route.authenticated === true) {	// Authenticated ANGULAR === TRUE
			if (!Auth.isLoggedIn()) {
				event.preventDefault()
				$location.path('/')
			}
		} else { 									// Authenticated ANGULAR === FALSE
			if (Auth.isLoggedIn()) {
				event.preventDefault()
				$location.path('/about')
			}
		}
	})	

}]
