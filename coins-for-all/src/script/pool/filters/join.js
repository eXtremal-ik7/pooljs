/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.filter('join', function() {
	// array join
	return function(ar, glue) {
		ar = ar.filter(function(v) {
			return !(v == null || v.length === 0);
		});
		return ar.join(glue);
	}
});
