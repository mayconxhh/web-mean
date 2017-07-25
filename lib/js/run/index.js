export default ['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User){

	// Access permits
	$rootScope.$on('$routeChangeStart', function(event, next, current){
		console.log(Auth.isLoggedIn())
		console.log(next.$$route.authenticated)

		if (next.$$route.authenticated === true) {	// Authenticated ANGULAR === TRUE
			if (!Auth.isLoggedIn()) {
				event.preventDefault()
				$location.path('/')
			} else if(next.$$route.permission) {
				User.checkPermission().then(function(res){
					if (res.data.permission !== next.$$route.permission[0] ) {
						if (res.data.permission !== next.$$route.permission[1]) {
							event.preventDefault()
							$location.path('/')
						}
					}
				}, function(err){
					console.log(err)
				})
			}
		} else { 									// Authenticated ANGULAR === FALSE
			if (Auth.isLoggedIn()) {
				event.preventDefault()
				$location.path('/about')
			}
		}
	})	

}]
