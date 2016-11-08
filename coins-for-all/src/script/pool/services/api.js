/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
angular.module('pool.api', ['pool.url'])
    .factory('api', ['$http', '$log', 'url', function($http, $log, url) {
        function ajax(method, url, data, query) {
            return $http({
                method: method,
                url: url,
                data: data,
                params: query
            }).then(function(res) {
                return res.data;
            }, function(res) {
                $log.error("Server error", res.status, res.data);
                throw res.data;
            });
        }

        function request(method, urlTempl) {
            var cache = {};
            function result(urlParams, data, query) {
                return ajax(method, result.url(urlParams), data, query);
            }
            result.url = function(urlParams, query) {
                var keys = angular.isObject(query) ? Object.keys(query).filter(function(p) { return query[p]; }) : [];
                return Pool.API_ROOT + url.interpolate(urlTempl, urlParams) + (keys.length ? '?' + url.param(query) : '');
            };
            result.cached = function(urlParams, data, query) {
                var key = [
                    url.param(urlParams, true),
                    query ? url.param(query) : undefined
                ].join('?');
                cache[key] = cache[key] || ajax(method, result.url(urlParams), data, query);
                return cache[key];
            };
            result.cache_clean = function() {
                cache = {};
            };
            return result;
        }

        return {
            getPoolStats: request('GET', ':code/poolStats'),
            getCoinBlocks: request('GET', ':code/foundBlocks'),
            getUserInfo: request('GET', ':code/clientInfo'),
            getUserStats: request('GET', ':code/clientStats'),
            getUserPayments: request('GET', ':code/payouts'),
            saveUserSettings: request('POST', ':code/settings'),
            payout: request('POST', ':code/payout')
        }
    }]);
