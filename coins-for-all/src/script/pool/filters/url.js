/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.filter('url', ['url', function(url) {
	return function(urlTempl, urlParams) {
		return angular.isString(urlTempl) ? url.interpolate(urlTempl, urlParams) : urlTempl;
	}
}]);
