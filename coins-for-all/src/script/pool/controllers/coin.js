/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.controller('CoinCtrl', ['$scope', 'view', 'api', 'utils',
    function($scope, view, api, utils) {
        var coinFetcherDelay = 60 * 1000,
            coinFetcher = utils.repeat(coinFetcherDelay, request),
            errorDelay = 15 * 1000;

        $scope.limit = 20;

        $scope.calculate = function() {
            $scope.openInfoDialog('Coming soon...');
        };

        $scope.account = function(userId) {
            view.go('wallet', {
                code: view.code,
                user: userId
            });
        };

        $scope.showMoreBlocks = function() {
            var blocks = $scope.blocks;
            if (!blocks || !blocks.length) return;
            var lastBlock = blocks[blocks.length - 1];
            coinFetcher.stop();
            getBlocks(
                lastBlock["height"],
                lastBlock["hash"]
            ).finally(function() {
                coinFetcher.start(coinFetcherDelay);
            });
        };

        $scope.getTemplateUrl = function(subtype) {
            return Pool.TMPL_ROOT + [view.code.toLowerCase(), subtype].join('-') + '.html';
        };

        $scope.$on('$routeChangeStart', function() {
            coinFetcher.stop();
        });

        function getStats() {
            return api.getPoolStats(view.code.toLowerCase()).then(function(stat) {
                $scope.stat = stat;
            }, processError);
        }

        function getBlocks(height, hash) {
            var showMoreBlocks = !!arguments.length;
            return api.getCoinBlocks(view.code.toLowerCase(), null, {
                heightFrom: height,
                hashFrom: hash,
                count: $scope.limit
            }).then(function(blocks) {
                $scope.blocks = showMoreBlocks ? $scope.blocks.concat(blocks) : blocks;
            }, processError);
        }

        function processError(error) {
            if (!error) return;
            $scope.$message.error(error, errorDelay);
        }

        function request() {
            getBlocks();
            getStats();
        }

        coinFetcher.start();
    }
]);
