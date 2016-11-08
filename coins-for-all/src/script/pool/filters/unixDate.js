/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.filter('unixDate', ['$filter', function($filter) {
    return function(time, format, timezone) {
        return angular.isNumber(time) ? $filter('date')(time * 1000, format || 'yyyy-MM-dd HH:mm:ss', timezone) : time;
    }
}]);