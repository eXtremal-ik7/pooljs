/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.directive('appTemplate', function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: function(elm, attrs) {
			return Pool.TMPL_ROOT + attrs.appTemplate + '.html';
		}
	}
});
