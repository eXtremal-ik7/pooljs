/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.controller('MainCtrl', ['$scope', 'view', 'utils',
	function($scope, view, utils) {
		$scope.view = view;

		function openPopupDialog(type, text) {
			if (!text) return;
			$scope.dialog.open('message', {
				message: text.toString(),
				type: type || 'error'}
			);
		}

		$scope.openErrorDialog = angular.bind(this, openPopupDialog, 'error');
		$scope.openInfoDialog = angular.bind(this, openPopupDialog, 'info');

		$scope.onChangeCoinEventClick = function(coin) {
			if (!coin) return;
			view.go('coin', {
				code: coin.code
			});
		};

		$scope.$on('$routeChangeSuccess', function(event, current, previous) {
			view.defaultParam('coin', utils.findElement(view.coins, {
				code: view.code
			}));
		});
	}
]);
