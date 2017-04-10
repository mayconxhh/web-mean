import Match from './match'

export default function(){
	var app = angular.module('MyApp')

	app.directive('match', Match)
}