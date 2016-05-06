;(function() {
"use strict";

var app = angular.module("app", ['ui.router', 'app.config', 'ngCookies', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '../app/components/static/home.view.html',
            data: {
                authorizedRoles: [USER_ROLES.ALL, USER_ROLES.MEMBER]
            }
        })
        .state('register', {
            url: '/register',
            templateUrl: '../app/components/register/register.view.html',
            controller: 'RegisterController',
            data: {
                authorizedRoles: [USER_ROLES.ALL, USER_ROLES.MEMBER]
            }
        });

    $urlRouterProvider.otherwise("/");

});

app.constant('USER_ROLES', {
    ALL: '*',
    MEMBER: 'MEMBER',
});

app.run(function($rootScope, AuthService, $state, Session) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
                $state.go("login");
            } else {
                $stateProvider.go("login");
            }
        }
    });
});

angular.module('app').controller('MainController', function($scope, $rootScope, Session, CookieFactory) {
    //create a default guest user
    Session.create('guest', '*');
    $rootScope.userRole = '*';
});

angular.module('app').factory('AuthService', function($http, Session, API_URL, CookieFactory) {
  var authService = {};

  authService.login = function(credentials) {
    return $http({
        method: 'POST',
        url: API_URL + "/user/login",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username: credentials.username,
          password: credentials.password
        }
      })
      .then(function(res) {
          console.log(res);
      });
  };

  //get userinfo based on token
  authService.userinfo = function() {
    var userToken = CookieFactory.getToken();
    return $http({
        method: 'GET',
        url: API_URL + "/user/info",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          token: userToken
        }
      })
      .then(function(res) {
        console.log(res);
      });
  };

  authService.register = function(credentials) {
    return $http({
        method: 'POST',
        url: API_URL + "/user/register",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username: credentials.username,
          password: credentials.password,
          email: credentials.email,
          name: credentials.name
        }
      })
      .then(function(res) {
        return res.data;
      });
  };

  //check is a username is set in the session
  authService.isAuthenticated = function() {
    return !!Session.userName;
  };

  authService.isAuthorized = function(authorizedRoles) {

    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }

    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };

  return authService;
});

//create a session
angular.module('app').service('Session', function() {

  this.create = function(userName, userRole) {
    this.userRole = userRole;
    this.userName = userName;
  };
  this.destroy = function() {
    this.userRole = null;
    this.userName = null;
  };
});

angular.module('app').factory('CookieFactory', function($http, Session, $cookies) {
  var cookieService = {};

  cookieService.getToken = function() {
    return $cookies.get('token');
  };

  cookieService.setToken = function(token) {
    $cookies.put('token', token);
  };
  
  return cookieService;
});

angular.module('app').controller('LoginController', function($scope, $rootScope, AuthService, $state) {
  $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.login = function(credentials) {
    AuthService.login(credentials).then(function(res) {
      if (res.STATE === "SUCCEEDED") {
        //updating the rootscope with role and  username, DONT PLACE TO MUCH IN THE ROOT!

        $rootScope.userRole = res.MESSAGE.Type;
        $rootScope.userName = res.MESSAGE.Name;
        //redirect < - should be made based on mentor / child
        $state.go("dashboard");
      } else {
        //throw error
      }
    });
  };  
});

angular.module('app').directive('footer', function() {
  return {
    restrict: 'E',
    templateUrl: '../app/components/navigation/footer.view.html'
  };
});

angular.module('app').controller('NavbarController', ['$scope', function($scope, $rootScope) {

}])

angular.module('app').directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: '../app/components/navigation/navbar.view.html',
    controller: 'NavbarController'
  };
});

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

angular.module("app.config", [])
.constant("API_URL", "http://localhost:8080");
}());
