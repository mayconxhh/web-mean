export default ['$scope', '$http', '$location', '$timeout', 'User', function($scope, $http, $location, $timeout, User){

	$scope.register = function(user, valid, confirmed){

		$scope.loading = true
		$scope.errorMsg = false
		if (valid) {
			if (confirmed) {
				User.create(user).then(function(res){
					var data = res.data
					if (data.success) {
						$scope.loading = false
						$scope.successMsg = res.data.msg + ' ....redirecting!'
						$timeout(function() {
							$location.path('/')	
						}, 2000);
					} else {
						$scope.loading = false
						$scope.errorMsg = res.data.msg				
					}
				}, function(err){
					console.log(err)
				})
			} else {
				$scope.loading = false
				$scope.errorMsg = 'Por favor, verifique que las contraseñas coincidan!'	
			}
		} else {
			$scope.loading = false
			$scope.errorMsg = 'Por favor, verifique que ha llenado los campos correctamente!'	
		}
	}

	$scope.checkUsername = function(user){
		$scope.checkingUsername 	= true
		$scope.usernameMsg 			= false
		$scope.usernameInvalid 		= false

		User.checkingUsername(user).then(function(res){
			var data = res.data
			if (data.success) {
				$scope.checkingUsername 	= false
				$scope.usernameInvalid 		= false
				$scope.usernameMsg 			= data.msg
			} else {
				$scope.checkingUsername 	= false
				$scope.usernameInvalid 		= true
				$scope.usernameMsg 			= data.msg
			}
		})
	}

	$scope.checkEmail = function(user){
		$scope.checkingEmail 	= true
		$scope.emailMsg 		= false
		$scope.emailInvalid 	= false

		User.checkingEmail(user).then(function(res){
			var data = res.data
			if (data.success) {
				$scope.checkingEmail 	= false
				$scope.emailInvalid 	= false
				$scope.emailMsg 		= data.msg
			} else {
				$scope.checkingEmail 	= false
				$scope.emailInvalid 	= true
				$scope.emailMsg 		= data.msg
			}
		})
	}

}]