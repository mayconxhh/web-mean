export default ['$scope', 'User', function($scope, User){

	$scope.loading = true;
	$scope.accessDenied = true;
	$scope.errorMsg = false;
	$scope.editAccess = false;
	$scope.deleteAccess = false;
	$scope.limit = 5;
	$scope.showMoreError = false;

	// Get all users
	function getUsers(){
		User.getUsers().then(function(res){
			var data = res.data
			if (data.success) {
				if (data.permission === 'admin' || data.permission === 'moderator') {
					$scope.users = data.users
					$scope.loading = false
					$scope.accessDenied = false;
					if (data.permission === 'admin') {
						$scope.editAccess = true;
						$scope.deleteAccess = true;
					} else if (data.permission === 'moderator') {
						$scope.editAccess = true;
					}
				} else {
					$scope.errorMsg = 'Permisos insuficientes'
					$scope.loading = false;
				}
			} else {
				$scope.errorMsg = data.msg
				$scope.loading = false;
			}
		}, function(err){
			$scope.errorMsg = err;
			$scope.loading = false;
		})
	}

	getUsers();

	// Filter show users
	$scope.showMore = function(number){
		$scope.showMoreError = false;
		if (number > 0) {
			$scope.limit = number;
		} else {
			$scope.showMoreError = 'Porfavor ingresa un número válido'
		}
	}

	// Filter show all users
	$scope.showAll = function(){
		$scope.limit = undefined
		$scope.showMoreError = false
	}

	// Delete user
	$scope.deleteUser = function(username){
		User.delete(username).then(function(res){
			var data = res.data
			if (data.success) {
				getUsers();
			} else {
				app.showMoreError = data.msg
			}
		}, function(err){
			console.log(err)
		})
	}
}]