export default ['$scope', 'User', function($scope, User){

	$scope.doResend = function(user){
		var user = user
		$scope.errorMsg = false
		$scope.successMsg = false
		User.checkCredential(user).then(function(res){
			var data = res.data
			if (data.success) {
				User.resendLink(user).then(function(res){
					console.log(res)
					var data = res.data
					if (data.success) {
						$scope.successMsg = data.msg
					} else {
						$scope.errorMsg = data.msg
					}
				}, function(err){
					console.log(err)
				})
			} else {
				$scope.errorMsg = data.msg
			}
		}, function(err){
			console.log(err)
		})
	}
}]