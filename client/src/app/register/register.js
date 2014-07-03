angular.module('register', [
    'ui.router',
    'authorization'
])

    .config(function config($stateProvider) {
        var access = routingConfig.accessLevels;

        $stateProvider.state('register', {
            url: '/register',
            views: {
                "main": {
                    controller: 'RegisterCtrl',
                    templateUrl: 'register/register.tpl.html'
                }
            },
            data: {
                pageTitle: 'Register',
                access: access.anon
            }
        });
    })

    .controller('RegisterCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        'Auth',
        function ($rootScope, $scope, $location, Auth) {
            $scope.role = Auth.userRoles.user;
            $scope.userRoles = Auth.userRoles;

            $scope.register = function () {
                Auth.register({
                        username: $scope.username,
                        email: $scope.email,
                        password: $scope.password,
                        role: $scope.role
                    },
                    function () {
                        $location.path('/');
                    },
                    function (err) {
                        $rootScope.error = angular.toJson(err);
                        $location.path('/register');
                    });
            };
        }]);
