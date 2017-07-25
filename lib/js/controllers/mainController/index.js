export default ['$scope', 'Auth', '$timeout', '$location', '$rootScope', '$interval', '$window', '$route', 'User', 'AuthToken', function($scope, Auth, $timeout, $location, $rootScope, $interval, $window, $route, User, AuthToken){

	$scope.loadme = false

	$scope.esActivo = function(rutaActual){
		return rutaActual === $location.path()
	}

  $scope.myModal = function(action){
    var modalContainer = document.querySelector('.viewModal')

    if (action === 'open') {
      modalContainer.style.display = 'block'
      var backgroundModal = document.createElement('div')
      backgroundModal.setAttribute('class','modal-backdrop fade in backgroundModal')
      document.querySelector('body').appendChild(backgroundModal)
    } else {
      modalContainer.style.display = 'none'
      var backgroundModal = document.querySelector('.backgroundModal')
      backgroundModal.remove()
    }
  }

  $scope.showModal = function(option){
    $scope.choiceMade = false
    $scope.modalHeader = undefined
    $scope.modalBody = undefined
    $scope.hideButtons = false

    if (option === 1) {
      $scope.modalHeader = 'Advertencia!'
      $scope.modalBody = 'Su sesión expirará en 5 minutos. ¿Desea renovar su sesión?'

      $scope.myModal('open')
      $timeout(function(){
        if (!$scope.choiceMade) $scope.myModal('close')
      }, 4000)

    } else if (option === 2) {
      $scope.hideButtons = true
      $scope.modalHeader = 'Cerrando sesión'
      $scope.myModal('open')
      $timeout(function(){
        Auth.logout()
        $location.path('/')
        $scope.myModal('close')
        $route.reload();
      }, 2000)
    }

  }

  $scope.endSession = function(){
    $scope.choiceMade = true
    $scope.myModal('close')
    $timeout(function(){
      $scope.showModal(2)
    }, 1000)
  }

  $scope.renewSession = function(){
    $scope.choiceMade = true

    User.renewSession($scope.user.username).then(function(res){
      if (res.data.success === true) {
        AuthToken.setToken(res.data.token)
        $scope.checkSession()
        $scope.myModal('close')
      } else {
        console.log(res.data.msg)
        $scope.modalBody = 'Ocurrió algo en el proceso... cerrando sessión'
        $timeout(function(){
          $scope.myModal('close')
          $scope.showModal(2)
        }, 1000)
      }
    })

  }

  $scope.checkSession = function(){
    if (Auth.isLoggedIn()) {
      $scope.checkingSession = true
      var interval = $interval(function(){
        var token = $window.localStorage.getItem('token')
        if (token === null) {
          $interval.cancel(interval)
        } else {
          self.parseJwt = function(token){
            var base64Url = token.split('.')[1]
            var base64 = base64Url.replace('-', '+').replace('_','/')
            return JSON.parse($window.atob(base64))
          }

          var expireTime = self.parseJwt(token)
          var timeStamp = Math.floor(Date.now()/1000);
          var timeCheck = expireTime.exp - timeStamp

          if (timeCheck <= 300) {
            $scope.showModal(1)
            $interval.cancel(interval)
          }

        }
      }, 2000)

    }
  }

  $scope.checkSession()
  $scope.isPermited = false

  $rootScope.$on('$routeChangeStart', function(){

    if (!$scope.checkSession) $scope.checkSession()

    if (Auth.isLoggedIn()) {
      $scope.isLoggedIn = true
      $scope.loadme = true
      Auth.getUser().then(function(res){
        $scope.user = res.data
        if (res.data.permission !== 'user') {
          $scope.isPermited = true
        } else {
          $scope.isPermited = false
        }
      }, function(err){
        console.log(err)
      })
    } else {
      $scope.isLoggedIn = false
      $scope.user = {}
      $scope.loadme = true
    }

    if ($location.hash() === '_=_') $location.hash(null)
  })

	$scope.doLogin = function(loginData){
		$scope.loading = true
		$scope.errorMsg = false
		$scope.expired = false

		Auth.login(loginData)
			.then(function(res){
				var data = res.data
				if (data.success) {
					$scope.loading = false
					$scope.successMsg = res.data.msg + ' ....redirecting!'
					$timeout(function() {
						$scope.loginData = {}
						$scope.successMsg = false
						$location.path('/about')
            $scope.checkSession()
					}, 2000);
				} else {
					if (data.expired) {
						$scope.expired = true
						$scope.loading = false
						$scope.errorMsg = res.data.msg
					} else {
						$scope.loading = false
						$scope.errorMsg = res.data.msg
					}
				}
			}, function(err){
				console.log(err)
			})
	}

	$scope.logout = function(){
		$scope.showModal(2)
	}
}]
