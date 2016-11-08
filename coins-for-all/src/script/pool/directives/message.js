/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.directive('appMessage', function() {
	var active = 'active', timeout;
	return function($scope, elm, attrs) {
		elm.html('<button type="button" class="close">&times;</button><div class="text"/>');
		var btn = elm.find('button'),
			content = elm.find('div');

		function remove() {
			clearTimeout(timeout);
			elm.removeClass(active);
			btn.unbind('click', remove);
		}

		function toggle(type, text, delay) {
			if (text) {
				elm.removeClass(Object.keys($scope.$message).join(' '));
				elm.addClass(type);
				content.text(text);
				btn.bind('click', remove);
				elm.hasClass(active) ? clearTimeout(timeout) : elm.addClass(active);
				if (delay)
					timeout = setTimeout(remove, delay);
			} else {
				remove();
			}
		}

		$scope.$on('$routeChangeStart', remove);

		$scope.$message = {
			primary: angular.bind(this, toggle, 'primary'),
			success: angular.bind(this, toggle, 'success'),
			info: angular.bind(this, toggle, 'info'),
			warning: angular.bind(this, toggle, 'warning'),
			error: angular.bind(this, toggle, 'error')
		};
	}
});
