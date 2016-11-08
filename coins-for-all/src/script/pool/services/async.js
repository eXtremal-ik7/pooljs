/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
angular.module('pool.async', [])
	.factory('async', ['$q', '$rootScope', '$log', function($q, $rootScope, $log) {
		function asyncApply(fn) {
			// making angular $digest cycle happy
			// https://github.com/angular/angular.js/issues/2023
			setTimeout(function() {
				fn();
				if (!$rootScope.$$phase) {
					$rootScope.$apply();
				} else {
					$log.error("Timeout in digest cycle");
				}
			}, 0);
		}

		function done(takeout, value, defer) {
			// return asynchronous resolved promise
			if (!defer) {
				if (!value || !angular.isFunction(value.resolve)) {
					defer = $q.defer();
				} else {
					defer = value;
					value = undefined;
				}
			}
			asyncApply(function() {
				defer[takeout](value);
			});
			return defer.promise;
		}
		return {
			resolve: angular.bind(this, done, 'resolve'),
			reject: angular.bind(this, done, 'reject'),
			notify: angular.bind(this, done, 'notify')
		}
	}]);
