/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.directive('appToggle', ['$document', function($document) {
	var wasOpen = undefined;
	return function($scope, elm, attrs) {
		function close(event) {
			if (event) {
				$document.unbind('click', close);
			}
			if (wasOpen) {
				$scope.$apply(function() {
					$scope[wasOpen] = wasOpen = undefined;
				});
			}
		}
		elm.bind('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$scope.$apply(function() {
				$scope[attrs.appToggle] = !$scope.$eval(attrs.appToggle);
			});
			if (angular.isUndefined(attrs.autoclose)) return;
			if (wasOpen && wasOpen !== attrs.appToggle) {
				close(true);
			}
			if ($scope[attrs.appToggle]) {
				wasOpen = attrs.appToggle;
				$document.bind('click', close);
			}
		});
	}
}]);
