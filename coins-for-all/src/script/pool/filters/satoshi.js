/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.filter('satoshi', function() {
    return function(val) {
        return angular.isNumber(val) ? val / 100e6 : val;
    }
});