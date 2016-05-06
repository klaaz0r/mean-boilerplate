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
