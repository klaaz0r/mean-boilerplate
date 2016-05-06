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
