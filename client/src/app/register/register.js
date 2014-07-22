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
        'growlNotifications',
        function ($rootScope, $scope, $location, Auth, growlNotifications) {
            var role = Auth.userRoles.user;

            $scope.register = function () {
                Auth.register({
                        username: $scope.username,
                        email: $scope.email,
                        password: $scope.password,
                        role: role,
                        verification: $scope.verification
                    },
                    function () {
                        $location.path('/');
                    },
                    function (err) {
                        growlNotifications.add(angular.fromJson(err), 'danger');
                        $location.path('/register');
                    });
            };
        }]);
