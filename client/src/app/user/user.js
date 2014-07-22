angular.module('user', [
    'ui.router',
    'ui.bootstrap',
    'authorization',
    'resources.users',
    'validation'
])

    /*
     * Route
     * */
    .config(function config($stateProvider) {
        var access = routingConfig.accessLevels;

        $stateProvider.state('user', {
            url: '/user',
            views: {
                "main": {
                    controller: 'UserCtrl',
                    templateUrl: 'user/user.tpl.html'
                }
            },
            data: {
                pageTitle: 'My Profile',
                access: access.user
            }
        });
    })

    /*
     * Controller
     * */
    .controller('UserCtrl', [
        '$scope',
        '$modal',
        'Auth',
        'Users',
        'growlNotifications',
        function ($scope, $modal, Auth, Users, growlNotifications) {
            $scope.user = Users.transform(Auth.user);

            $scope.update = function () {
                var user = $scope.user;

                user.$update(function () {
                    Auth.update(user);
                });
            };

            $scope.openPasswordModal = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ModalInstanceCtrl,
                    size: size,
                    resolve: {
                        user: function () {
                            return $scope.user;
                        }
                    }
                });
            };

            // Please note that $modalInstance represents a modal window (instance) dependency.
            // It is not the same as the $modal service used above.

            var ModalInstanceCtrl = function ($scope, $modalInstance, user) {
                $scope.data = {
                    "password": "",
                    "verification": ""
                };

                $scope.ok = function () {
                    user.$changePassword($scope.data.password, $scope.data.verification).then(function () {
                        $modalInstance.close();
                    }, function (err) {
                        growlNotifications.add(err, 'danger');
                    });

                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }])
;