
angular.module('admin.doctors', [
    'xeditable',
    'resources.doctors'
])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('admin.doctor', {
            url: '/doctors',
            views: {
                "admin": {
                    controller: 'DoctorCtrl',
                    templateUrl: 'admin/doctors/doctors.tpl.html'
                }
            }
        });
    }])

    .controller('DoctorCtrl', ['$scope', 'Doctors', function ($scope, Doctor) {
        $scope.doctors = [];

        //Load Doctors
        Doctor.all(function (data) {
            $scope.doctors = data;
        }, function (err) {
            $rootScope.error = err;
            $scope.doctors = [];
        });

        $scope.saveDoctor = function (data, doctor) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    doctor[key] = data[key];
                }
            }

            doctor.$saveOrUpdate();
        };

        $scope.removeDoctor = function (index, doctor) {
            doctor.$remove(function () {
                $scope.doctors.splice(index, 1);
            });
        };

        $scope.addDoctor = function () {
            Doctor.defaultModel(function (data) {
                $scope.doctors.push(new Doctor(data));
            });
        };

    }]);