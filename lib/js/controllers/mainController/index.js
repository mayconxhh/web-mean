export default ['$scope', 'Auth', '$timeout', '$location', '$rootScope', function($scope, Auth, $timeout, $location, $rootScope){
	
	$scope.loadme = false

	$scope.esActivo = function(rutaActual){
		return rutaActual === $location.path()
	}

	$rootScope.$on('$routeChangeStart', function(){
		if (Auth.isLoggedIn()) {
			$scope.isLoggedIn = true
			$scope.loadme = true
			Auth.getUser().then(function(res){
				$scope.user = res.data
			}, function(err){
				console.log(err)
			})
		} else {
			$scope.isLoggedIn = false
			$scope.user = {}
			$scope.loadme = true
		}

		if ($location.hash() === '_=_') $location.hash(null)
	})

	
	$scope.doLogin = function(loginData){
		$scope.loading = true
		$scope.errorMsg = false
		$scope.expired = false

		Auth.login(loginData)
			.then(function(res){
				var data = res.data
				if (data.success) {
					$scope.loading = false
					$scope.successMsg = res.data.msg + ' ....redirecting!'
					$timeout(function() {
						$scope.loginData = {}
						$scope.successMsg = false
						$location.path('/about')
					}, 2000);
				} else {
					if (data.expired) {
						$scope.expired = true
						$scope.loading = false
						$scope.errorMsg = res.data.msg	
					} else {
						$scope.loading = false
						$scope.errorMsg = res.data.msg
					}			
				}
			}, function(err){
				console.log(err)
			})
	}

	$scope.logout = function(){
		Auth.logout()
		$location.path('/logout')
		$timeout(function() {
			$location.path('/')
		}, 2000)
	}
}]