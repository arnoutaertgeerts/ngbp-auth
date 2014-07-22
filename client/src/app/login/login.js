angular.module('login', [
    'ui.router',
    'authorization'
])

    .config(function config($stateProvider) {
        var access = routingConfig.accessLevels;

        $stateProvider.state('login', {
            url: '/login',
            views: {
                "main": {
                    controller: 'LoginCtrl',
                    templateUrl: 'login/login.tpl.html'
                }
            },
            data: {
                pageTitle: 'Login',
                access: access.anon
            }
        });
    })

    .controller('LoginCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        'Auth',
        'growlNotifications',
        function ($rootScope, $scope, $location, $window, Auth, growlNotifications) {

            $scope.rememberme = true;
            $scope.login = function () {
                Auth.login({
                        username: $scope.username,
                        password: $scope.password,
                        rememberme: true
                    },
                    function (res) {
                        $location.path('/home');
                    },
                    function (err) {
                        growlNotifications.add(angular.fromJson(err), 'danger');
                        $location.path('/login');
                    });
            };

            $scope.loginOauth = function (provider) {
                $window.location.href = '/auth/' + provider;
            };
        }]);