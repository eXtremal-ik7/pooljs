/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
angular.module('pool.view', ['pool.url'])
    .factory('view', ['$route', '$rootScope', '$location', 'url', function($route, $rootScope, $location, url) {
        var urlMap = {},
            urlDefault = $route.routes[null],
            inlineParams,
            historyPath,
            view = {},
            params = function() {
                // little magic goes here
                var Dummy = function() {};
                Dummy.prototype = view;
                return new Dummy();
            }();

        urlDefault = urlDefault ? urlDefault.redirectTo : '/';
        angular.forEach($route.routes, function(desc, urlTempl) {
            if (desc.name)
                urlMap[desc.name] = urlTempl;
        });

        $rootScope.$on('$routeChangeSuccess', function(event, nextRoute) {
            view.name = nextRoute.name;
            view.area = view.name && view.name.split('-', 1)[0];
            if (!inlineParams || angular.isArray(inlineParams)) {
                angular.copy(nextRoute.params, params);
            } else if (inlineParams != params) {
                angular.copy(inlineParams, params);
            }
            inlineParams = null;
            if (!nextRoute.historyOff) {
                historyPath = $location.path();
            }
        });

        function path(name, params) {
            return url.interpolate(urlMap[name] || urlDefault, params);
        }

        view.href = function(name, params) {
            return Pool.URL_PREFIX + path(name, params);
        };
        view.previous = function(params) {
            inlineParams = params;
            $location.path(historyPath);
        };
        view.go = function(name, params) {
            inlineParams = params;
            $location.path(path(name, params));
        };
        view.defaultParam = function(name, value) {
            if (angular.isUndefined(value))
                return view[name];
            return view[name] = value;
        };
        return params;
    }]);
