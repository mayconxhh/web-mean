export default ['$scope', 'User', function($scope, User){

	$scope.loading = true;
	$scope.accessDenied = true;
	$scope.errorMsg = false;
	$scope.editAccess = false;
	$scope.deleteAccess = false;
	$scope.limit = 5;
	$scope.showMoreError = false;
	// search
	$scope.searchLimit = 0;

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

	// Search user
	$scope.search = function(searchKeyword, number){
		if (searchKeyword) {
			if (searchKeyword.length > 0) {
				$scope.limit = 0
				$scope.searchFilter = searchKeyword
				$scope.limit = number
			} else {
				$scope.searchFilter = undefined
				$acope.limit = 0
			}
		} else {
			$scope.searchFilter = undefined
			$scope.limit = 0
		}
	}

	// clean input search
	$scope.clean = function(){
		$scope.number = 'Clear'
		$scope.limit = 0
		$scope.searchKeyword = undefined
		$scope.searchFilter = undefined
		$scope.showMoreError = false
	}

	// SEARCHER

	$scope.advancedSearch = function(searchByUsername, searchByEmail, searchByName){
		if (searchByUsername || searchByEmail || searchByName) {
			$scope.advancedSearchFilter = {}
			if (searchByUsername) {
				$scope.advancedSearchFilter.username = searchByUsername
			}
			if (searchByEmail) {
				$scope.advancedSearchFilter.email = searchByEmail
			}
			if (searchByName) {
				$scope.advancedSearchFilter.name = searchByName
			}
			$scope.searchLimit = undefined
		}
	}

	$scope.sortOrder = function(order){
		$scope.sort = order
	}
}]