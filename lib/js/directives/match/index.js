export default [function(){
	return {
		restrict: 'A',
		controller: function($scope){

			$scope.confirmed = false

			$scope.doConfirm = function(values){
				values.forEach(function(value){
					if ($scope.confirm === value) {
						$scope.confirmed = true
					} else {
						$scope.confirmed = false
					}
				})
			}
		},
		link: function(scope, element, attrs){
			attrs.$observe('match', function(){
				scope.matches = JSON.parse(attrs.match)
				scope.doConfirm(scope.matches)
			})

			scope.$watch('confirm', function(){
				scope.matches = JSON.parse(attrs.match)
				scope.doConfirm(scope.matches)
			})
		}
	}
}]