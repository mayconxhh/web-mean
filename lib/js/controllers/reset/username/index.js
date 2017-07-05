export default ['$scope', '$location', '$timeout', 'User', function($scope, $location, $timeout, User){
	$scope.doRequestUsername = function(user, valid){
		var user = user
		$scope.errorMsg = false
		$scope.successMsg = false
		if (valid) {
      User.sendUsername(user.email).then(function(res){
  			var data = res.data
  			if (data.success) {
          $scope.successMsg = data.msg + '...redirecting'
          $timeout(function(){
            $location.path('/login')
          }, 2000)
  			} else {
  				$scope.errorMsg = data.msg
  			}
  		}, function(err){
  			console.log(err)
  		})
		} else {
      $scope.errorMsg = 'Porfavor ingresa un e-mail válido!'
    }
	}
}]
