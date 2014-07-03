/**
 * Created by arnoutaertgeerts on 3/5/14.
 */

angular.module('resources.doctors', ['database']);

angular.module('resources.doctors').factory('Doctors', ['Database', function ($db) {
    var Doctors = $db('doctors');

    return Doctors;

}]);
