import angular from 'angular'
import config from './config'
import controllers from './controllers'
import services from './services'
import run from './run'
import directives from './directives'

global.jQuery = require('jquery')
require('bootstrap')
require('angular-route')
require('angular-animate')

var myApp = angular.module('MyApp', ['ngRoute', 'ngAnimate'])

myApp.config(config)
myApp.run(run)

controllers()
services()
directives()