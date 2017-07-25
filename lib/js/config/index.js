export default ['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor')

  $routeProvider
    .when('/', {
      templateUrl: '/partials/home'
    })
    .when('/register', {
      templateUrl: '/partials/register',
      controller: 'UserController',
      authenticated: false
    })
    .when('/login', {
      templateUrl: '/partials/login',
      authenticated: false
    })
    .when('/about', {
      templateUrl: '/partials/about',
      authenticated: true
    })
    .when('/logout', {
      templateUrl: '/partials/logout',
      authenticated: true
    })
    .when('/profile', {
      templateUrl: '/partials/profile',
      authenticated: true
    })
    .when('/social/:token', {
      templateUrl: '/partials/social',
      controller: 'Social',
      authenticated: false
    })
    .when('/socialerror', {
      templateUrl: '/partials/socialerror',
      controller: 'Social',
      authenticated: false
    })
    .when('/inactive/error', {
      templateUrl: '/partials/inactive/error',
      controller: 'Social',
      authenticated: false
    })
    .when('/activate/:token', {
      templateUrl: '/partials/activate',
      controller: 'Email',
      authenticated: false
    })
    .when('/resend', {
      templateUrl: 'partials/resend',
      controller: 'Resend',
      authenticated: false
    })
    .when('/reset/password', {
      templateUrl: 'partials/reset/password',
      controller: 'ResetPassword',
      authenticated: false
    })
    .when('/reset/username', {
      templateUrl: 'partials/reset/username',
      controller: 'ResetUsername',
      authenticated: false
    })
    .when('/reset/newpassword/:token', {
      templateUrl: 'partials/reset/newpassword',
      controller: 'NewPassword',
      authenticated: false
    })
    .when('/management', {
      templateUrl: 'partials/management',
      controller: 'managementCtrl',
      authenticated: true,
      permission: ['admin', 'moderator']
    })
    .when('/404', {
      templateUrl: '/partials/404'
    })
    .otherwise({
      redirectTo: '/404',
    })

  $locationProvider.html5Mode(true)
}]
