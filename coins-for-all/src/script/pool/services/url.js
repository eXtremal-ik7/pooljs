/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
angular.module('pool.url', [])
    .factory('url', function() {
        return {
            interpolate: function(urlTempl, urlParams) {
                var changer, urlParams = angular.copy(urlParams);
                if (!angular.isObject(urlParams)) {
                    urlParams = [urlParams];
                }
                function parse(val, isOptional, slash) {
                    if (isOptional) {
                        return angular.isDefined(val) ? (val + (slash || '')) : '';
                    } else {
                        return val;
                    }
                }
                if (angular.isArray(urlParams)) {
                    changer = function(s, paramName, isOptional, slash) {
                        return parse(urlParams.shift(), isOptional, slash);
                    }
                } else if (angular.isObject(urlParams)) {
                    changer = function(s, paramName, isOptional, slash) {
                        return parse(urlParams[paramName], isOptional, slash);
                    }
                }
                return urlTempl.replace(/:(\w+)(\?(\/)?)?/g, changer);
            },

            param: function(obj, forceArray) {
                var res = [];
                if (!angular.isObject(obj)) {
                    res.push(encodeURIComponent(obj));
                } else if (angular.isArray(obj) || forceArray) {
                    angular.forEach(obj, function(v) {
                        res.push(encodeURIComponent(v));
                    });
                } else {
                    angular.forEach(obj, function(v, k) {
                        res.push(k + '=' + encodeURIComponent(v));
                    });
                }
                return res.join('&');
            }
        }
    });
