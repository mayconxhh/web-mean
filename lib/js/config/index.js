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
			controller: 'Email'
		})
		.when('/resend', {
			templateUrl: 'partials/resend',
			controller: 'Resend'
		})
		.when('/404', {
			templateUrl: '/partials/404'
		})
		.otherwise({
			redirectTo: '/404',
		})

	$locationProvider.html5Mode(true)
}]