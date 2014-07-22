angular.module('resources.users', ['database']);

angular.module('resources.users').factory('Users', ['$q', 'Database', function ($q, $db) {
    var Users = $db('users');

    Users.prototype.$changePassword = function(password, verification) {
        var deferred = $q.defer();

        if(password != verification) {
            deferred.reject('Passwords do not match');
        }
        else {
            this['password'] = password;
            this['verification'] = verification;
            this.$update(function() {
                deferred.resolve();
            }, function(err) {
                deferred.reject('Password must be between 5-20 characters long.');
            });
        }

        return deferred.promise;
    };

    return Users;
}]);
