angular.module('app').controller('MainController', function($scope, $rootScope, Session, CookieFactory) {
    //create a default guest user
    Session.create('guest', '*');
    $rootScope.userRole = '*';
});
