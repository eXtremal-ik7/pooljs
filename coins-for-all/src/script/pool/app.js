/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal = angular.module('pool.portal', [
	'ngRoute',
	'pool.api',
	'pool.async',
	'pool.static',
	'pool.url',
	'pool.utils',
	'pool.view'
]).config(['$routeProvider', '$locationProvider', function($routeProvider, $location) {
	$location.hashPrefix('!');
	$routeProvider.
		when('/', {
			templateUrl: tmpl('pool'),
			name: 'pool',
			controller: 'PoolCtrl' }).
		when('/coin/:code', {
			templateUrl: tmpl('coin'),
			name: 'coin',
			controller: 'CoinCtrl' }).
		when('/coin/:code/wallet/:user', {
			templateUrl: tmpl('wallet'),
			name: 'wallet',
			controller: 'WalletCtrl' }).
		otherwise({ redirectTo: '/' });
	function tmpl(name) {
		return Pool.TMPL_ROOT + name + '.html';
	}
}]).run(['view', function(view) {
	view.defaultParam('coins', Pool.coins || []);
}]);
