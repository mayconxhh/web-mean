export default ['$scope', 'User', function($scope, User){
	$scope.doRequestPassword = function(resetData, valid){
		var resetData = resetData
		$scope.errorMsg = false
		$scope.successMsg = false
    User.sendPassword(resetData).then(function(res){
      var data = res.data
      if (data.success) {
        $scope.successMsg = data.msg
      } else {
        $scope.errorMsg = data.msg
      }
    }, function(err){
      console.log(err)
    })
	}
}]
