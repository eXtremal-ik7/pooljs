/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
angular.module('pool.static', ['pool.async'])
	.factory('static', ['$http', '$q', '$templateCache', 'async', function($http, $q, $templateCache, async) {
		var head = document.getElementsByTagName('head')[0],
			loaded = Pool.portal.cache = Pool.portal.cache || { script: {} };
			// global cache for script loading
			// not per application

		function injectScript(url, onready) {
			var script = document.createElement('script'),
				first = head.getElementsByTagName('script')[0], done;
			script.src = url;
			// TODO: scirpt.onerror, timeout
			script.onreadystatechange = script.onload = function() {
				if (!done && (!script.readyState || /loaded|complete/.test(script.readyState))) {
					done = true;
					script.onload = script.onreadystatechange = null;
					onready();
				}
			};
			first ? head.insertBefore(script, first) : head.appendChild(script);
		}

		function url(prefix, suffix, name) {
			if (!name) {
				name = suffix;
				suffix = null
			}
			return prefix + name + (suffix || '');
		}

		function loadScript(base) {
			function result(name) {
				if (loaded.script[name]) {
					return async.resolve();
				} else {
					var defer = $q.defer();
					injectScript(result.url(name), function() {
						loaded.script[name] = true;
						async.resolve(defer);
					});
					return defer.promise;
				}
			}
			result.url = angular.bind(this, url, base, '.js');
			return result
		}

		function getStatic(base, suffix, cache) {
			function result(name) {
				var url = result.url(name),
					cached = cache && cache.get(url);
				if (cached)
					return async.resolve(cached[1]);
				// TODO: how to $digest-friendly abstract cache?
				// $timeout(angular.noop);
				return $http.get(url, {cache: cache}).then(function(res) {
					return res.data;
				});
			}
			result.url = angular.bind(this, url, base, suffix);
			return result;
		}

		return {
			include: getStatic(Pool.INCLUDE_ROOT),
			tmpl: getStatic(Pool.TMPL_ROOT, '.html', $templateCache),
			script: loadScript(Pool.SCRIPT_ROOT)
		}
	}]);
