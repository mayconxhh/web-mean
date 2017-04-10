export default ['$scope', '$routeParams', 'Auth', '$location', '$window', function($scope, $routeParams, Auth, $location, $window){

	$scope.errorMsg = false
	$scope.expired = false

	if ($window.location.pathname === '/socialerror') {
		$scope.errorMsg = 'No se encontró el usuario en la base de datos!'
	} else if($window.location.pathname === '/inactive/error'){
		$scope.expired = true
		$scope.errorMsg = 'Tu cuenta no esta activa! Porfavor revisa tu e-mail para ver el enlace de validación.'
	} else {
		var token = $routeParams.token
		Auth.social(token)
		$location.path('/about')		
	}

}]