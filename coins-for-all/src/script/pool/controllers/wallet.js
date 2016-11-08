/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.controller('WalletCtrl', ['$scope', '$filter', 'view', 'api', 'utils',
    function($scope, $filter, view, api, utils) {
        var walletFetcherDelay = 60 * 1000,
            walletFetcher = utils.repeat(walletFetcherDelay, request),
            errorDelay = 15 * 1000,
            infoDelay = 5 * 1000;

        $scope.limit = 20;
        $scope.settings = {};

        $scope.saveSettings = function(settings) {
            var form = $scope.form && $scope.form.settings;
            if (!form || form.$invalid) return;
            form.$setPristine();
            api.saveUserSettings(view.code.toLowerCase(), null, {
                userId: view.user,
                minimalPayout: settings["minimalPayout"] * 100e6
            }).then(function() {
                $scope.$message.info("Settings saved successfully", infoDelay);
                getUserInfo();
            }, function(error) {
                form.$setDirty();
                processError(error);
            });
        };

        $scope.payout = function(balance) {
            if (!balance) return;
            api.payout(view.code.toLowerCase(), null, {
                userId: view.user
            }).then(function() {
                $scope.$message.info("Payment request has been sent", infoDelay);
            }, processError);
        };

        $scope.showMorePayments = function() {
            var payments = $scope.payments;
            if (!payments || !payments.length) return;
            var lastPayment = payments[payments.length - 1];
            walletFetcher.stop();
            getUserPayments(lastPayment["time"]).finally(function() {
                walletFetcher.start(walletFetcherDelay);
            });
        };

        $scope.$on('$routeChangeStart', function() {
            walletFetcher.stop();
        });

        function getUserInfo() {
            return api.getUserInfo(view.code.toLowerCase(), null, {
                userId: view.user
            }).then(function(info) {
                $scope.info = info;
                $scope.settings["minimalPayout"] = info ? $filter('satoshi')(info["minimalPayout"]) : undefined;
            }, processError);
        }

        function getUserStats() {
            return api.getUserStats(view.code.toLowerCase(), null, {
                userId: view.user
            }).then(function(stats) {
                $scope.stats = stats ? stats.total : undefined;
                $scope.workers = stats ? stats.workers : [];
            }, processError);
        }

        function getUserPayments(time) {
            var showMorePayments = !!arguments.length;
            return api.getUserPayments(view.code.toLowerCase(), null, {
                userId: view.user,
                timeFrom: time,
                count: $scope.limit
            }).then(function(payments) {
                $scope.payments = showMorePayments ? $scope.payments.concat(payments) : payments;
            }, processError);
        }

        function processError(error) {
            if (!error) return;
            $scope.$message.error(error, errorDelay);
        }

        function request() {
            getUserInfo();
            getUserPayments();
            getUserStats();
        }

        walletFetcher.start();
    }
]);
