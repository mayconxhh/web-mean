export default ['$scope', 'User', '$routeParams', '$timeout', '$location', function($scope, User, $routeParams, $timeout, $location){

	var token = $routeParams.token

	$scope.errorMsg = false
	User.accountActivate(token).then(function(res){
		$scope.errorMsg = false
		$scope.successMsg = false
		var data = res.data

		if (data.success) {
			$scope.successMsg = data.msg
			$timeout(function() {
				$location.path('/login')
			}, 2000);
		} else {
			$scope.errorMsg = data.msg
			$timeout(function() {
				$location.path('/login')
			}, 2000);
		}
	}, function(err){
		console.log(err)
	})
}]