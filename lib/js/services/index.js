import User from './user'
import Auth from './auth'
import AuthToken from './authToken'
import AuthInterceptor from './authInterceptor'

export default function(){
	var app = angular.module('MyApp')

	app.factory('User', User)
	app.factory('Auth', Auth)
	app.factory('AuthToken', AuthToken)
	app.factory('AuthInterceptor', AuthInterceptor)
}