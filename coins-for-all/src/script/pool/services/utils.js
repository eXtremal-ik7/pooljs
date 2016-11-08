/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
angular.module('pool.utils', [])
	.service('utils', ['$q', function($q) {
		function Repeater(delay, func) {
			this.delay = delay;
			this.func = func;
			this.callback = function noop(v) { return v };
			this.errback = function rethrow(e) { return e; };

			this._timeoutId = null;
			this._promise = null;
		}

		function cycle(self, pp, resp, val) {
			if (pp == self._promise) {
				self._promise = null;
				exec(self, self.delay);
				return self[resp](val);
			}
			// nothing here:
			// simple ignoring a result
			return null;
		}

		function exec(self, delay) {
			self._timeoutId = setTimeout(function() {
				self._timeoutId = null;
				var funcDefer = $q.defer();
				var pp = self._promise = funcDefer.promise.then(function(v) {
					return cycle(self, pp, 'callback', v);
				}, function(e) {
					return cycle(self, pp, 'errback', e);
				});
				funcDefer.resolve(self.func());
			}, delay);
		}

		Repeater.prototype = {
			start: function(initialDelay, func) {
				func = func || this.func;
				initialDelay = initialDelay || 0;
				if (func != this.func || this._timeoutId || initialDelay > 0 && this._promise) {
					this.stop();
					this.func = func;
				}
				if (!angular.isFunction(this.func) || initialDelay == 0 && this._promise) // already executed
					return false;
				exec(this, initialDelay);
				return true;
			},
			stop: function() {
				if (this._promise) {
					this._promise = null;
				} else if (this._timeoutId) {
					clearTimeout(this._timeoutId);
					this._timeoutId = null;
				}
			},
			state: function() {
				if (this._promise)
					return "EXECUTED";
				if (this._timeoutId)
					return "PENDING";
				return "STOPPED";
			},
			then: function(callback, errback) {
				// must be queues of callbacks (like $q)
				this.callback = angular.isFunction(callback) ? callback : angular.noop;
				this.errback = angular.isFunction(errback) ? callback : angular.noop;
			}
		};

		this.repeat = function(delay, func) {
			return new Repeater(delay, func);
		};

		this.dehydrate = function(obj, props) {
			var self = this, res = angular.isArray(obj) ? [] : {};
			angular.forEach(obj, function(v, k) {
				if (angular.isNumber(k)) {
					res[k] = self.dehydrate.call(self, v, props);
				} else if (props.indexOf(k) != -1) {
					res[k] = angular.copy(v);
				}
			});
			return res;
		};

		this.extracted = function(obj) {
			if (!angular.isObject(obj)) return obj;
			var res = {};
			angular.forEach(obj, function(val, key) {
				if (key.charAt(0) !== '$' && val != null && val !== '')
					res[key] = angular.copy(val);
			});
			return res;
		};

		this.findElement = function(arr, obj) {
			if (!angular.isArray(arr)) return;
			var keys = Object.keys(obj || {});
			for (var i = arr.length; i--;) {
				if (angular.equals(this.dehydrate(arr[i], keys), obj)) {
					return arr[i];
				}
			}
		};
	}]);
