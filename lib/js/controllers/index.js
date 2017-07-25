import UserController from './userController'
import MainController from './mainController'
import Social from './social'
import Email from './email'
import Resend from './resend'
import ResetUsername from './reset/username'
import ResetPassword from './reset/password'
import NewPassword from './reset/newPassword'
import Management from './management'

export default function(){
  var app = angular.module('MyApp')
  app.controller('UserController', UserController)
  app.controller('MainController', MainController)
  app.controller('Social', Social)
  app.controller('Email', Email)
  app.controller('Resend', Resend)
  app.controller('ResetUsername', ResetUsername)
  app.controller('ResetPassword', ResetPassword)
  app.controller('NewPassword', NewPassword)
  app.controller('managementCtrl', Management)
}
