angular.module('resources.users', ['database']);

angular.module('resources.users').factory('Users', ['Database', function ($db) {
    var Users = $db('users');

    return Users;
}]);
