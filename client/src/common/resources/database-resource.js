/*
 * The database resource that can be used by other factories to easily call the WhatsIn API.
 * */
angular.module('database', []);
angular.module('database').factory('Database', ['$http', '$q', function ($http, $q) {
    /*
     * Define the name of the collection to modify or query.
     * */
    function databaseFactory(collectionName) {
        // Create the url to connect to the API
        var url, defaultParams;
        url = '/api/' + collectionName;
        defaultParams = {};

        /*
         * Handles the promises of a request and returns the response as a (list of) Resource object(s) if
         * the request is successful
         * */
        var thenFactoryMethod = function (httpPromise, successcb, errorcb, isArray) {
            var scb = successcb || angular.noop;
            var ecb = errorcb || angular.noop;

            // Handle the returned request of the server
            return httpPromise.then(function (response) {
                var result;
                if (isArray) {
                    result = [];
                    for (var i = 0; i < response.data.length; i++) {
                        result.push(new Resource(response.data[i]));
                    }
                } else {
                    // Check if the server found the requested item
                    if (response.data === "not found") {
                        return $q.reject({
                            code: 'resource.notfound',
                            collection: collectionName
                        });
                    } else {
                        // Interpret the requested object as a new Resource object. This way you can use the
                        // instance methods.
                        result = new Resource(response.data);
                    }
                }
                scb(result, response.status, response.headers, response.config);
                return result;
            }, function (response) {
                ecb(undefined, response.status, response.headers, response.config);
                return undefined;
            });
        };

        // Extend the object with the given data. This way you can instantiate a new model for the database and call
        // instance methods on it
        var Resource = function (data) {
            angular.extend(this, data);
        };

        Resource.transform = function(data) {
            return new Resource(data);
        };

        // Make a query (GET-request) to the database for the entered collection
        Resource.query = function (queryJson, successcb, errorcb) {
            // api/:collectionName/?query
            var params, httpPromise;
            params = angular.isObject(queryJson) ? {q: JSON.stringify(queryJson)} : {};
            httpPromise = $http.get(
                url,
                {params: angular.extend({}, defaultParams, params)}
            );
            return thenFactoryMethod(httpPromise, successcb, errorcb, true);
        };

        // Request all the objects from the database
        Resource.all = function (cb, errorcb) {
            // api/:collectionName/?
            return Resource.query({}, cb, errorcb);
        };

        // Request an object by it's id
        Resource.getById = function (id, successcb, errorcb) {
            // api/:collectionName/:id
            var httpPromise = $http.get(url + '/' + id, {params: defaultParams});
            return thenFactoryMethod(httpPromise, successcb, errorcb);
        };

        // Request multiple objects by their ids
        Resource.getByIds = function (ids, successcb, errorcb) {
            // api/:collectionName/?query
            var qin = [];
            angular.forEach(ids, function (id) {
                qin.push({$oid: id});
            });
            return Resource.query({_id: {$in: qin}}, successcb, errorcb);
        };

        // Request the current resource saved in the session on the server
        Resource.current = function (successcb, errorcb) {
            var httpPromise = $http.get(url + '/current', {params:defaultParams});
            return thenFactoryMethod(httpPromise, successcb, errorcb);
        };

        //Request a default Model from the server
        Resource.defaultModel = function (successcb, errorcb) {
            var httpPromise = $http.get(url + '/default', {params:defaultParams});
            return thenFactoryMethod(httpPromise, successcb, errorcb);
        };

        // Instance methods
        Resource.prototype.$id = function () {
            if (this._id && this._id.$oid) {
                return this._id.$oid;
            }

            if (this._id) {
                return this._id;
            }
            else {
                return false;
            }
        };

        Resource.prototype.$save = function (successcb, errorcb) {
            var httpPromise = $http.post(url, this, {params: defaultParams});
            return thenFactoryMethod(httpPromise, successcb, errorcb);
        };

        Resource.prototype.$update = function (successcb, errorcb) {
            // api/:collectionName/:$id
            var httpPromise = $http.put(url + '/' + this.$id(), angular.extend({}, this, {id: this.$id()}), {params: defaultParams});
            return thenFactoryMethod(httpPromise, successcb, errorcb);
        };

        Resource.prototype.$updateEmbedded = function (path, embedded, params, successcb, errorcb) {
            // api/:collectionName/:this.id/path/:embedded.id
            console.log(this);

            var httpPromise = $http.post(
                url + "/" + this.$id() + "/" + path + "/" + embedded.id,
                angular.extend({}, embedded),
                {params: defaultParams}
            );
            return thenFactoryMethod(httpPromise, successcb, errorcb);
        };

        Resource.prototype.$remove = function (successcb, errorcb) {
            // api/collectionName/:$id
            var httpPromise = $http['delete'](url + "/" + this.$id(), {params: defaultParams});
            return thenFactoryMethod(httpPromise, successcb, errorcb);
        };

        Resource.prototype.$saveOrUpdate = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
            if (this.$id()) {
                return this.$update(updatecb, errorUpdatecb);
            } else {
                return this.$save(savecb, errorSavecb);
            }
        };

        return Resource;
    }

    return databaseFactory;
}]);