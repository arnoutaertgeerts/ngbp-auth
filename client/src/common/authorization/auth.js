angular.module('authorization', [
    'ngCookies'
])

    /*
    * Authorization service
    *
    * */
    .factory('Auth', function ($http, $cookieStore) {

        var accessLevels = routingConfig.accessLevels,
            userRoles = routingConfig.userRoles,
            currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

        $cookieStore.remove('user');

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        return {
            authorize: function (accessLevel, role) {
                if (role === undefined) {
                    role = currentUser.role;
                }

                return accessLevel.bitMask & role.bitMask;
            },

            isLoggedIn: function (user) {
                if (user === undefined) {
                    user = currentUser;
                }
                return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
            },

            register: function (user, success, error) {
                $http.post('/register', user).success(function (res) {
                    res.role = userRoles[res.role];
                    changeUser(res);
                    success();
                }).error(function(err) {
                    error(err);
                });
            },

            login: function (user, success, error) {
                $http.post('/login', user).success(function (user) {
                    user.role = userRoles[user.role];
                    changeUser(user);
                    success(user);
                }).error(error);
            },

            logout: function (success, error) {
                $http.post('/logout').success(function () {
                    changeUser({
                        username: '',
                        email: '',
                        role: userRoles.public
                    });
                    success();
                }).error(error);
            },

            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    })


    /*
    * Authorization directive
    *
    * */
    .directive('accessLevel', ['Auth', function(Auth) {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {
                var prevDisp = element.css('display'),
                    userRole,
                    accessLevel;

                $scope.user = Auth.user;
                $scope.$watch('user', function(user) {
                    if(user.role) {
                        userRole = user.role;
                    }
                    updateCSS();
                }, true);

                attrs.$observe('accessLevel', function(al) {
                    if(al) {
                        accessLevel = routingConfig.accessLevels[al];
                    }
                    updateCSS();
                });

                function updateCSS() {
                    if(userRole && accessLevel) {
                        if(!Auth.authorize(accessLevel, userRole)) {
                            element.css('display', 'none');
                        }
                        else {
                            element.css('display', prevDisp);
                        }
                    }
                }
            }
        };
    }]);