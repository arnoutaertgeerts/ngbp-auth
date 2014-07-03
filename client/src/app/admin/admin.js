
angular.module('admin', [
    'admin.users',
    'admin.doctors'
])

    .config(['$stateProvider', function ($stateProvider) {
        var access = routingConfig.accessLevels;

        $stateProvider.state('admin', {
            url: '/admin',
            views: {
                "main": {
                    controller: 'AdminCtrl',
                    templateUrl: 'admin/admin.tpl.html'
                }
            },
            data: {
                pageTitle: 'Admin',
                access: access.public
            }
        });
    }])

    .controller('AdminCtrl', ['$scope', '$state', function ($scope, $state) {
        console.log($state);
    }]);