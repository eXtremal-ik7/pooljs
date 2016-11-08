/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.directive('appStopEvent', function() {
	var defaultMethods = ['stopPropagation', 'preventDefault'];
	return function($scope, elm, attrs) {
		var methods = attrs.methods ? attrs.methods.split(',') : defaultMethods;
		elm.bind(attrs.appStopEvent, function(event) {
			for (var i = methods.length; i--;)
				event[methods[i].trim()]();
		});
	}
});
