angular.module('resources.users', ['database']);

angular.module('resources.users').factory('Users', ['Database', function ($db) {
    var Users = $db('users');

    Users.prototype.$changePassword = function(password, verification) {
        if(password != verification) {
            return false;
        }
        else {
            this['password'] = password;
            this.$update();
        }
    };

    return Users;
}]);
