angular.module('app').controller('RegisterController', function($scope, AuthService) {
  $scope.credentials = {
    username: '',
    password: '',
    email: '',
    name: ''
  };

  $scope.register = function(credentials) {
      console.log(credentials);
  };});
