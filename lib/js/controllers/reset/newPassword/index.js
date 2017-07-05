export default ['$scope', '$routeParams', '$location', '$timeout', 'User', function($scope, $routeParams, $location, $timeout, User){

  $scope.hideForm = true
  User.resetUser($routeParams.token).then(function(res){
    if (res.data.success) {
      $scope.hideForm = false
      $scope.successMsg = 'Porfavor ingresa una nueva contraseña'
      $scope.username = res.data.user.username
    } else {
      $scope.errorMsg = res.data.msg
    }
  })

	$scope.savePassword = function(newData, valid, confirmed){
    $scope.errorMsg = false
    $scope.successMsg = false

    if (valid && confirmed) {
      newData.username = $scope.username
      User.savePassword(newData).then(function(res){
        var data = res.data
        if (data.success) {
          $scope.successMsg = data.msg+ '...redirecting'
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
      $scope.errorMsg = 'Porfavor asegurese que llenó correctamente el formulario'
    }
	}
}]
