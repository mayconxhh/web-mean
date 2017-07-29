export default ['$scope', 'User', '$routeParams', '$timeout', function($scope, User, $routeParams, $timeout){

	$scope.nameTab = 'active'
	$scope.phase1 = true
	$scope.updateUser = {}

	User.getUser($routeParams.id_user).then(function(res){
		var data = res.data
		if (data.success) {
			$scope.updateUser.newName = data.user.name
			$scope.updateUser.newUsername = data.user.username
			$scope.updateUser.newEmail = data.user.email
			$scope.updateUser.newPermission = data.user.permission
			$scope.currentUser = data.user._id
		} else {
			$scope.errorMsg = data.msg
		}
	}, function(err){
		console.log(err)
	})
	
	$scope.namePhase = function(){
		$scope.nameTab = 'active'
		$scope.usernameTab = 'default'
		$scope.emailTab = 'default'
		$scope.permissionsTab = 'default'
		$scope.phase1 = true
		$scope.phase2 = false
		$scope.phase3 = false
		$scope.phase4 = false
		$scope.errorMsg = false
		$scope.successMsg = false
	};

	$scope.usernamePhase = function(){
		$scope.nameTab = 'default'
		$scope.usernameTab = 'active'
		$scope.emailTab = 'default'
		$scope.permissionsTab = 'default'
		$scope.phase1 = false
		$scope.phase2 = true
		$scope.phase3 = false
		$scope.phase4 = false
		$scope.errorMsg = false
		$scope.successMsg = false
	};

	$scope.emailPhase = function(){
		$scope.nameTab = 'default'
		$scope.usernameTab = 'default'
		$scope.emailTab = 'active'
		$scope.permissionsTab = 'default'
		$scope.phase1 = false
		$scope.phase2 = false
		$scope.phase3 = true
		$scope.phase4 = false
		$scope.errorMsg = false
		$scope.successMsg = false
	};

	$scope.permissionsPhase = function(){
		$scope.nameTab = 'default'
		$scope.usernameTab = 'default'
		$scope.emailTab = 'default'
		$scope.permissionsTab = 'active'
		$scope.phase1 = false
		$scope.phase2 = false
		$scope.phase3 = false
		$scope.phase4 = true
		$scope.errorMsg = false
		$scope.successMsg = false

		$scope.disabledUser = ($scope.updateUser.newPermission === 'user') ? true : false
		$scope.disabledModerator = ($scope.updateUser.newPermission === 'moderator') ? true : false
		$scope.disabledAdmin = ($scope.updateUser.newPermission === 'admin') ? true : false
	};

	$scope.updateName = function(newUser, validate){
		$scope.errorMsg = false
		$scope.successMsg = false

		var user = {}

		if (validate) {
			user.currentUser = $scope.currentUser
			user.name = newUser.newName
			User.editUser(user).then(function(res){
				var data = res.data;
				if (data.success) {
					$scope.successMsg = data.msg
					$timeout(function(){
						$scope.nameForm.name.$setPristine()
						$scope.nameForm.name.$setUntouched()
						$scope.successMsg = false
					}, 2000)
				} else {
					$scope.errorMsg = data.msg
				}
			}, function(err){
				$scope.errorMsg = err
			})
		} else {
			$scope.errorMsg = 'Por favor ingrese los campos correctamente'
		}
	}

	$scope.updateUsername = function(newUser, validate){
		$scope.errorMsg = false
		$scope.successMsg = false

		var user = {}

		if (validate) {
			user.currentUser = $scope.currentUser
			user.username = newUser.newUsername
			User.editUser(user).then(function(res){
				var data = res.data;
				if (data.success) {
					$scope.successMsg = data.msg
					$timeout(function(){
						$scope.usernameForm.username.$setPristine()
						$scope.usernameForm.username.$setUntouched()
						$scope.successMsg = false
					}, 2000)
				} else {
					$scope.errorMsg = data.msg
				}
			}, function(err){
				$scope.errorMsg = err
			})
		} else {
			$scope.errorMsg = 'Por favor ingrese los campos correctamente'
		}
	}

	$scope.updateEmail = function(newUser, validate){
		$scope.errorMsg = false
		$scope.successMsg = false

		var user = {}

		if (validate) {
			user.currentUser = $scope.currentUser
			user.email = newUser.newEmail
			User.editUser(user).then(function(res){
				var data = res.data;
				if (data.success) {
					$scope.successMsg = data.msg
					$timeout(function(){
						$scope.emailForm.email.$setPristine()
						$scope.emailForm.email.$setUntouched()
						$scope.successMsg = false
					}, 2000)
				} else {
					$scope.errorMsg = data.msg
				}
			}, function(err){
				$scope.errorMsg = err
			})
		} else {
			$scope.errorMsg = 'Por favor ingrese los campos correctamente'
		}
	}

	$scope.updatePermission = function(newUser){
		$scope.errorMsg = false
		$scope.successMsg = false
		
		$scope.disabledUser = false
		$scope.disabledModerator = false
		$scope.disabledAdmin = false

		var user = {}

		user.currentUser = $scope.currentUser
		user.permission = newUser.newPermission
		User.editUser(user).then(function(res){
			var data = res.data;
			if (data.success) {
				$scope.successMsg = data.msg
				$scope.updateUser.newPermission = user.permission
				$scope.disabledUser = (newUser.newPermission === 'user') ? true : false
				$scope.disabledModerator = (newUser.newPermission === 'moderator') ? true : false
				$scope.disabledAdmin = (newUser.newPermission === 'admin') ? true : false
				$timeout(function(){
					$scope.successMsg = false
				}, 2000)
			} else {
				$scope.errorMsg = data.msg
			}
		}, function(err){
			$scope.errorMsg = err
		})
	}

}]