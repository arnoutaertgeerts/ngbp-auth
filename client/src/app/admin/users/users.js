
angular.module('admin.users', [
    'xeditable',
    'resources.users'
])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('admin.user', {
            url: '/users',
            views: {
                "admin": {
                    controller: 'UserCtrl',
                    templateUrl: 'admin/users/users.tpl.html'
                }
            }
        });
    }])

    .controller('UserCtrl', ['$scope', 'Users', function ($scope, User) {
        $scope.users = [];

        //Load users
        User.all(function (data) {
            $scope.users = data;
        }, function (err) {
            $rootScope.error = err;
            $scope.users = [];
        });

        $scope.saveUser = function (data, user) {
            console.log(data);
            console.log(user);

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    user[key] = data[key];
                }
            }

            user.$saveOrUpdate();
        };

        $scope.removeUser = function (index, user) {
            user.$remove(function () {
                $scope.users.splice(index, 1);
            });
        };

        $scope.addUser = function () {
            User.defaultModel(function (data) {
                $scope.users.push(new User(data));
            });
        };

    }])

    .directive('adminUser', [function () {
        return {
            restrict: 'E',
            templateUrl: 'admin/users/directive.tpl.html',
            scope: {
                users: '=users',
                //Make sure to explicitly set the parameters in the html directive function (e.g.: {event:event})
                add: '&',
                remove: '&',
                save: '&'
            },
            link: function(scope) {
                scope.$watch('students', function(value) {
                    scope.students = value;
                });
            }
        };
    }]);