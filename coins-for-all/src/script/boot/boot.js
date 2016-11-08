/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
(function (window, document, undefined) {
    'use strict';
    window.Pool = window.Pool || {};

    angular.extend(window.Pool, {
        API_ROOT: 'api/',
        INCLUDE_ROOT: 'static/i/',
        SCRIPT_ROOT: 'static/s/',
        STYLE_ROOT: 'static/s/',
        FILE_ROOT: 'static/f/',
        TMPL_ROOT: 'static/s/templates/',
        URL_PREFIX: '#!'
    });

    function onready(handler) {
        var triggered = false;

        function preventTwiceHandler() {
            if (!triggered) {
                triggered = true;
                handler();
            }
        }

        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", preventTwiceHandler, false);
        } else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState == "complete")
                    preventTwiceHandler()
            });
        }
    }

    function startPool($http, $log) {
        $http.get(window.Pool.FILE_ROOT + 'coins.json').success(function(coins) {
            window.Pool.coins = coins;
        }).finally(function() {
            window.Pool.coins = window.Pool.coins || [];
            $log.log('starting pool');
            angular.bootstrap(document, ['pool.portal']);
        });
    }

    onready(function() {
        var app = angular.injector(['ng', 'pool.static']);
        app.invoke(['$http', '$log', 'static', function($http, $log, stat) {
            $log.log('loading...');
            var init = angular.bind(window.Pool, startPool, $http, $log);
            if (!Object.keys || !window.JSON) {
                stat.script('polyfill').finally(init);
            } else {
                init();
            }
        }]);

    });
})(window, document, undefined);
