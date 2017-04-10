import UserController from './userController'
import MainController from './mainController'
import Social from './social'
import Email from './email'
import Resend from './resend'

export default function(){
	var app = angular.module('MyApp')
	app.controller('UserController', UserController)
	app.controller('MainController', MainController)
	app.controller('Social', Social)
	app.controller('Email', Email)
	app.controller('Resend', Resend)
}